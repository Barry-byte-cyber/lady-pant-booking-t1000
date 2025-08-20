import React, { useState, useMemo } from "react";
import CalendarView from "./CalendarView";
import { TIMES } from "../App";

const DAY_CAP = 100; // ✅ single source of truth for daily item cap

export default function AdminView({ bookings, addBooking, cancelBooking }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    items: "",
  });
  const [search, setSearch] = useState("");

  // Filter bookings by search name (case-insensitive)
  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return bookings.filter((b) => (b.name || "").toLowerCase().includes(q));
  }, [bookings, search]);

  // Count total items booked for the selected date
  const totalItemsForDate = useMemo(() => {
    if (!form.date) return 0;
    return bookings
      .filter((b) => b.date === form.date)
      .reduce((sum, b) => sum + Number(b.items || 0), 0);
  }, [bookings, form.date]);

  const remainingItems = Math.max(0, DAY_CAP - totalItemsForDate);

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

    const totalAfter = totalItemsForDate + itemsNum;
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

    // Reset but keep the selected date for convenience
    setForm({
      name: "",
      email: "",
      phone: "",
      date,
      time: "",
      items: "",
    });
  };

  // When clicking a date on the calendar, prefill form.date
  const handleCalendarDateClick = (dateStr) => {
    setForm((f) => ({ ...f, date: dateStr, time: "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-2">🔑 Admin View</h2>
      <p className="text-gray-600 text-center mb-6">
        Staff can create and cancel bookings on behalf of clients.
      </p>

      {/* Client-style layout: left wide (2 cols), right sidebar calendar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: wide column */}
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
                  {TIMES.map((t) => (
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
                  disabled={!form.date || remainingItems <= 0}
                />

                <div className="flex items-center text-sm text-gray-700">
                  Day cap: <b className="ml-1">{DAY_CAP}</b>
                  <span className="ml-2">
                    • Remaining today: <b>{remainingItems}</b>
                  </span>
                </div>
              </div>

              {form.date && remainingItems <= 0 && (
                <p className="text-red-600 text-sm">
                  Day is full ({DAY_CAP}/{DAY_CAP}). Please choose another date.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={!form.date || remainingItems <= 0}
              >
                Create Booking
              </button>
            </form>
          </div>

          {/* Search Bookings by Client Name */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">
              Search Pending Bookings by Client Name
            </h3>
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
        </div>

        {/* RIGHT: calendar sidebar (scrolls; ~2 months visible) */}
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