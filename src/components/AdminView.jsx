import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import CalendarView from "./CalendarView";
import { TIMES } from "../App";
import { sendConfirmationEmail } from "../utils/emailHelper";

// Robust import for closed‑day rules
import * as rules from "../config/calendarRules";
const isClosedDay = (d) => {
  const fn = rules.isBlockedDate ?? rules.default;
  return typeof fn === "function" ? fn(d) === true : false;
};

const DAY_CAP = 100;

// utils
function timeLabelToMinutes(label) {
  const [hm, ap] = label.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

export default function AdminView({ bookings, addBooking, cancelBooking, getTakenTimes }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    items: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [nameSearch, setNameSearch] = useState("");

  // sync date from calendar clicks
  useEffect(() => {
    if (selectedDate) {
      setForm((f) => ({ ...f, date: selectedDate, time: "" }));
    }
  }, [selectedDate]);

  const takenTimes = useMemo(
    () => (form.date ? getTakenTimes?.(form.date) ?? new Set() : new Set()),
    [getTakenTimes, form.date]
  );
  const availableTimes = useMemo(
    () => (form.date ? TIMES.filter((t) => !takenTimes.has(t)) : TIMES),
    [form.date, takenTimes]
  );

  const totalItemsForDate = useMemo(() => {
    if (!form.date) return 0;
    return bookings
      .filter((b) => b.date === form.date)
      .reduce((sum, b) => sum + (Number(b.items) || 0), 0);
  }, [bookings, form.date]);

  const bookingsForSelected = useMemo(() => {
    if (!selectedDate) return [];
    return bookings
      .filter((b) => b.date === selectedDate)
      .slice()
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [bookings, selectedDate]);

  const pendingByName = useMemo(() => {
    const q = nameSearch.trim().toLowerCase();
    const today = dayjs().format("YYYY-MM-DD");
    if (!q) return [];
    return bookings
      .filter(
        (b) =>
          (b.name || "").toLowerCase().includes(q) &&
          (b.date || "") >= today
      )
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [bookings, nameSearch]);

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    const { name, email, date, time, items } = form;

    // required
    if (!name || !email || !date || !time || !items) {
      alert("Please fill all required fields.");
      return;
    }

    const d = dayjs(date, "YYYY-MM-DD");
    try {
      if (isClosedDay(d)) {
        alert("We’re closed on that date. Please choose another date.");
        return;
      }
    } catch (err) {
      console.error("Closed‑day check failed; treating as open day:", err);
    }

    const itemsNum = Number(items);
    if (!Number.isFinite(itemsNum) || itemsNum <= 0) {
      alert("Items must be a positive number.");
      return;
    }

    // 4:00 PM max 30
    if (time === "4:00 PM" && itemsNum > 30) {
      alert("4:00 PM slot allows a maximum of 30 items.");
      return;
    }

    // >60 only before 11:00
    if (itemsNum > 60) {
      const tMins = timeLabelToMinutes(time);
      const eleven = timeLabelToMinutes("11:00 AM");
      if (tMins >= eleven) {
        alert("Bookings over 60 items must be scheduled before 11:00 AM.");
        return;
      }
    }

    // daily cap
    const totalAfter = totalItemsForDate + itemsNum;
    if (totalAfter > DAY_CAP) {
      alert(`This booking would exceed the daily cap of ${DAY_CAP} items.`);
      return;
    }

    setSubmitting(true);
    try {
      addBooking({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: (form.phone || "").trim(),
        date,
        time,
        items: itemsNum,
      });

      try {
        await sendConfirmationEmail({
          toEmail: email.trim().toLowerCase(),
          toName: name.trim(),
          date,
          time,
          items: itemsNum,
          phone: (form.phone || "").trim(),
          email: email.trim().toLowerCase(), // reply-to
        });
        setBanner({ type: "success", text: "✅ Confirmation email sent." });
      } catch (err) {
        console.error("Admin confirmation email failed (non‑blocking):", err);
        setBanner({ type: "error", text: "⚠️ Booking saved, but email failed." });
      }

      // reset but keep chosen date (handy for multiple entries)
      setForm({ name: "", email: "", phone: "", date, time: "", items: "" });
    } catch (err) {
      console.error("addBooking threw:", err);
      alert("Sorry, we couldn’t save that booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     <section className="lg:col-span-2 space-y-6">
      <div className="sticky top-12 bg-white shadow-md p-4 w-full z-10">
        <h2 className="text-2xl font-bold text-center">🔑 Admin View</h2>
        <p className="text-gray-600 text-center mb-4">
          Staff can create and cancel bookings on behalf of clients.
        </p>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-gray-50 rounded-lg p-4">
          {banner && (
            <div
              className={`mb-3 rounded-md p-2 text-sm ${
                banner.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {banner.text}
            </div>
          )}

          <h3 className="font-semibold mb-3">Create Booking (Admin)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Client Name *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="email"
              placeholder="Client Email *"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="border p-2 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: "" }))}
              className="border p-2 rounded text-sm"
              required
            />

            <select
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="border p-2 rounded text-sm"
              required
            >
              <option value="">{form.date ? "Time *" : "Select date first"}</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder={form.time === "4:00 PM" ? "Items * (max 30 at 4 PM)" : "Items *"}
              value={form.items}
              onChange={(e) => setForm((f) => ({ ...f, items: e.target.value }))}
              min="1"
              max={form.time === "4:00 PM" ? 30 : 100}
              className="border p-2 rounded text-sm"
              required
            />

            <div className="flex items-center text-sm text-gray-600">
              <span>
                Day cap: 100. Remaining today: {Math.max(0, DAY_CAP - totalItemsForDate)}.
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create Booking"}
            </button>
          </div>
        </form>

        {/* Name lookup for pending bookings */}
        <div className="max-w-5xl mx-auto mt-4 bg-white rounded-lg p-4 border">
          <h3 className="font-semibold mb-2">Search Pending Bookings by Client Name</h3>
          <input
            type="text"
            placeholder="Start typing a client name…"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="border p-2 rounded text-sm w-full mb-3"
          />
          {nameSearch.trim() ? (
            pendingByName.length > 0 ? (
              <ul className="space-y-2 max-h-56 overflow-auto pr-1">
                {pendingByName.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded gap-2"
                  >
                    <span className="text-sm">
                      <b>{b.name}</b> — {b.email}
                      {b.phone ? ` — 📞 ${b.phone}` : ""} — <b>{b.date}</b> at {b.time} — {b.items} items
                    </span>
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="text-red-600 hover:underline self-start sm:self-center"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No pending bookings match that name.</p>
            )
          ) : (
            <p className="text-sm text-gray-600">Type a name to see bookings for today and later.</p>
          )}
        </div>
      </div>
</section>
      <aside className="lg:col-span-1">
  <div className="sticky top-24">
    <div className="bg-white rounded-lg shadow p-3 h-[calc(100vh-160px)] overflow-y-auto">
      <h3 className="font-semibold mb-2">Booking Calendar</h3>
      <CalendarView bookings={bookings} onDateClick={setSelectedDate} sidebar />
    </div>
  </div>
</aside>

      {/* Day details + cancel */}
      {selectedDate && (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h3 className="font-semibold mb-4">Bookings for {selectedDate}</h3>
          {bookingsForSelected.length > 0 ? (
            <ul className="space-y-2">
              {bookingsForSelected.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded gap-2"
                >
                  <span>
                    <span className="font-medium">{b.time || "No time"}</span> — {b.name} ({b.email})
                    {b.phone ? ` — 📞 ${b.phone}` : ""} — {b.items} items
                  </span>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-600 hover:underline self-start sm:self-center"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}