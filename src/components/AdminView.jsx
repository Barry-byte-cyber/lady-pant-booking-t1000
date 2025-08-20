import React, { useMemo, useState } from "react";
import CalendarView from "./CalendarView";
import { TIMES } from "../App";

const DAY_CAP = 100;

export default function AdminView({ bookings, addBooking, cancelBooking, getTakenTimes }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    items: "",
  });
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter by client name (case-insensitive)
  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return bookings.filter((b) => (b.name || "").toLowerCase().includes(q));
  }, [bookings, search]);

  // Items already booked for form.date
  const totalItemsForFormDate = useMemo(() => {
    if (!form.date) return 0;
    return bookings
      .filter((b) => b.date === form.date)
      .reduce((sum, b) => sum + Number(b.items || 0), 0);
  }, [bookings, form.date]);

  const remainingForFormDate = Math.max(0, DAY_CAP - totalItemsForFormDate);

  // Taken times for the chosen date (prevents duplicate slot booking)
  const takenTimes = useMemo(() => {
    if (!getTakenTimes || !form.date) return new Set();
    return getTakenTimes(form.date) || new Set();
  }, [getTakenTimes, form.date]);

  const availableTimes = useMemo(
    () => TIMES.filter((t) => !takenTimes.has(t)),
    [takenTimes]
  );

  // Bookings list for the calendar-selected day (right now we show it in the left column)
  const bookingsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return bookings
      .filter((b) => b.date === selectedDate)
      .slice()
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [bookings, selectedDate]);

  const totalItemsForSelectedDate = useMemo(
    () => bookingsForSelectedDate.reduce((sum, b) => sum + Number(b.items || 0), 0),
    [bookingsForSelectedDate]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, date, time, items } = form;

    if (!name || !email || !date || !time || !items) {
      alert("Please fill all required fields.");
      return;
    }

    const itemsNum = Number(items);
    if (!Number.isFinite(itemsNum) || itemsNum <= 0) {
      alert("Items must be a positive number.");
      return;
    }

    const totalAfter = totalItemsForFormDate + itemsNum;
    if (totalAfter > DAY_CAP) {
      alert(`This booking would exceed the daily cap of ${DAY_CAP} items.`);
      return;
    }

    addBooking({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (form.phone || "").trim(),
      date,
      time,
      items: itemsNum,
    });

    // Reset but keep the chosen date (handy for multiple entries)
    setForm({ name: "", email: "", phone: "", date, time: "", items: "" });
  };

  // Calendar click: prefill form date AND reveal the bookings panel
  const handleCalendarDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setForm((f) => ({ ...f, date: dateStr, time: "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-2">🔑 Admin View</h2>
      <p className="text-gray-600 text-center mb-6">
        Staff can create and cancel bookings on behalf of clients.
      </p>

      {/* 2-column layout (left wide, right calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: wide content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Booking */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Create Booking (Admin)</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Client Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Client Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })}
                  className="w-full border p-2 rounded"
                />

                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border p-2 rounded"
                  disabled={!form.date}
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
                  min="1"
                  placeholder="Items *"
                  value={form.items}
                  onChange={(e) => setForm({ ...form, items: e.target.value })}
                  className="w-full border p-2 rounded"
                  disabled={!form.date || remainingForFormDate <= 0}
                />

                <div className="flex items-center text-sm text-gray-700">
                  Day cap: <b className="ml-1">{DAY_CAP}</b>
                  <span className="ml-2">
                    • Remaining today: <b>{remainingForFormDate}</b>
                  </span>
                </div>
              </div>

              {form.date && remainingForFormDate <= 0 && (
                <p className="text-red-600 text-sm">
                  Day is full ({DAY_CAP}/{DAY_CAP}). Please choose another date.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={!form.date || remainingForFormDate <= 0}
              >
                Create Booking
              </button>
            </form>
          </div>

          {/* Search Bookings by Client Name */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Search Pending Bookings by Client Name</h3>
            <input
              type="text"
              placeholder="Type a client name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <ul className="mt-3 space-y-2 text-sm max-h-64 overflow-auto pr-1">
              {filteredBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="mb-1 sm:mb-0">
                    <b>{b.name}</b> — {b.date} {b.time ? `at ${b.time}` : ""} — {b.items} items
                  </span>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-600 hover:underline self-start sm:self-center"
                  >
                    Cancel
                  </button>
                </li>
              ))}
              {!filteredBookings.length && search.trim() && (
                <li className="text-gray-500">No results.</li>
              )}
            </ul>
          </div>

          {/* Bookings for the calendar-selected date */}
          {selectedDate && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">Bookings for {selectedDate}</h3>
              {bookingsForSelectedDate.length ? (
                <>
                  <p className="text-sm text-gray-700 mb-2">
                    Total items: <b>{totalItemsForSelectedDate}</b>
                  </p>
                  <ul className="space-y-2">
                    {bookingsForSelectedDate.map((b) => (
                      <li
                        key={b.id}
                        className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded gap-2"
                      >
                        <span>
                          <span className="font-medium">{b.time || "No time"}</span> — {b.name} (
                          {b.email})
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
                </>
              ) : (
                <p className="text-sm text-gray-600">No bookings for this date.</p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: calendar sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-3 h-[calc(100vh-180px)] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Booking Calendar</h3>
            <CalendarView
              bookings={bookings}
              onDateClick={handleCalendarDateClick}
              sidebar
            />
          </div>
        </aside>
      </div>
    </div>
  );
}