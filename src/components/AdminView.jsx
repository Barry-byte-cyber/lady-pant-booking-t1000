import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import CalendarView from "./CalendarView";
import { TIMES } from "../App";

function AdminView({ bookings, addBooking, cancelBooking, getTakenTimes }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Admin booking form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Name lookup (today + future)
  const [nameSearch, setNameSearch] = useState("");

  // Prefill date from calendar clicks
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setTime("");
    }
  }, [selectedDate]);

  const takenTimes = useMemo(
    () => (getTakenTimes ? getTakenTimes(date) : new Set()),
    [getTakenTimes, date]
  );
  const availableTimes = useMemo(
    () => (date ? TIMES.filter((t) => !takenTimes.has(t)) : TIMES),
    [date, takenTimes]
  );

  const bookingsForDate = useMemo(
    () => (selectedDate ? bookings.filter((b) => b.date === selectedDate) : []),
    [bookings, selectedDate]
  );

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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !date || !time || !items) {
      alert("❌ Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      addBooking({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date,
        time,
        items: parseInt(items, 10),
      });
      // keep focus on selected date
      setName("");
      setEmail("");
      setPhone("");
      setItems("");
      setTime("");
      setSelectedDate(date);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Sticky header + Admin form (top-12 so it clears TestBanner) */}
      <div className="sticky top-12 bg-white shadow-md p-4 w-full z-10">
        <h2 className="text-2xl font-bold text-center">🔑 Admin View</h2>
        <p className="text-gray-600 text-center mb-4">
          Staff can create and cancel bookings on behalf of clients.
        </p>

        <form onSubmit={handleAdminSubmit} className="max-w-5xl mx-auto bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Create Booking (Admin)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Client Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="email"
              placeholder="Client Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="border p-2 rounded text-sm"
              required
            />

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 rounded text-sm"
              required
            >
              <option value="">{date ? "Time *" : "Select date first"}</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder={time === "4:00 PM" ? "Items * (max 30 at 4 PM)" : "Items *"}
              value={items}
              onChange={(e) => setItems(e.target.value)}
              min="1"
              max={time === "4:00 PM" ? 30 : 80}
              className="border p-2 rounded text-sm"
              required
            />

            <div className="flex items-center text-sm text-gray-600">
              <span>
                Day cap: 80. {time === "4:00 PM" ? "4 PM cap: 30." : "One booking per time."}
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

      {/* Calendar */}
      <div className="w-full max-w-6xl px-4">
        <CalendarView bookings={bookings} onDateClick={setSelectedDate} />
      </div>

      {/* Day details + cancel */}
      {selectedDate && (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h3 className="font-semibold mb-4">Bookings for {selectedDate}</h3>
          {bookingsForDate.length > 0 ? (
            <ul className="space-y-2">
              {bookingsForDate
                .slice()
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                .map((b) => (
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

export default AdminView;