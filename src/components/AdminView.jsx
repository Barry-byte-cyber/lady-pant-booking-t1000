import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import CalendarView from "./CalendarView";
import { TIMES } from "../App";

function AdminView({ bookings, addBooking, cancelBooking, getTakenTimes }) {
  console.log("AdminView loaded from src/components/AdminView.jsx");

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

  async function handleAdminSubmit(e) {
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
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">🔑 Admin View</h2>
        <p className="text-gray-600">
          Staff can create and cancel bookings on behalf of clients.
        </p>
      </div>

      {/* === 2/3 left content + 1/3 sticky calendar === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT (2/3): create + search + day details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Booking (Admin) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold mb-3">Create Booking (Admin)</h3>

            <form
              onSubmit={handleAdminSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
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
                <option value="">
                  {date ? "Time *" : "Select date first"}
                </option>
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder={
                  time === "4:00 PM"
                    ? "Items * (max 30 at 4 PM)"
                    : "Items *"
                }
                value={items}
                onChange={(e) => setItems(e.target.value)}
                min="1"
                max={time === "4:00 PM" ? 30 : 80}
                className="border p-2 rounded text-sm"
                required
              />

              <div className="flex items-center text-sm text-gray-600 md:col-span-3">
                <span>
                  Day cap: 80.{" "}
                  {time === "4:00 PM" ? "4 PM cap: 30." : "One booking per time."}
                </span>
              </div>

              <div className="mt-1 md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Create Booking"}
                </button>
              </div>
            </form>
          </div>

          {/* Search Pending Bookings by Client Name */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold mb-2">
              Search Pending Bookings by Client Name
            </h3>
            <input
              type="text"
              placeholder="Start typing a client name…"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="border p-2 rounded text-sm w-full mb-3"
            />

            {nameSearch.trim() ? (
              pendingByName.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-auto pr-1">
                  {pendingByName.map((b) => (
                    <li
                      key={b.id}
                      className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded gap-2"
                    >
                      <span className="text-sm">
                        <b>{b.name}</b> — {b.email}
                        {b.phone ? ` — 📞 ${b.phone}` : ""} —{" "}
                        <b>{b.date}</b> {b.time ? `at ${b.time}` : ""} —{" "}
                        {b.items} items
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
                <p className="text-sm text-gray-600">
                  No pending bookings match that name.
                </p>
              )
            ) : (
              <p className="text-sm text-gray-600">
                Type a name to see bookings for today and later.
              </p>
            )}
          </div>

          {/* Day details for selected date */}
          {selectedDate && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="font-semibold mb-3">
                Bookings for {selectedDate}
              </h3>
              {bookingsForDate.length > 0 ? (
                <ul className="space-y-2">
                  {bookingsForDate
                    .slice()
                    .sort((a, b) =>
                      (a.time || "").localeCompare(b.time || "")
                    )
                    .map((b) => (
                      <li
                        key={b.id}
                        className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded gap-2"
                      >
                        <span>
                          <span className="font-medium">
                            {b.time || "No time"}
                          </span>{" "}
                          — {b.name} ({b.email})
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
                <p className="text-sm text-gray-600">
                  No bookings for this date.
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT (1/3): sticky calendar sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow p-3 h-[calc(100vh-160px)] overflow-y-auto">
              <h3 className="text-sm font-semibold mb-2">Calendar</h3>
               <CalendarView
               bookings={bookings}
               onDateClick={setSelectedDate}
               sidebar
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminView;