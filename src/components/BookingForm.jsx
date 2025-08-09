import React, { useMemo, useState } from "react";
import { TIMES } from "../App";

function BookingForm({ addBooking, bookings = [], getTakenTimes }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const takenTimes = useMemo(() => (getTakenTimes ? getTakenTimes(date) : new Set()), [getTakenTimes, date]);
  const availableTimes = useMemo(
    () => (date ? TIMES.filter((t) => !takenTimes.has(t)) : TIMES),
    [date, takenTimes]
  );

  const handleSubmit = async (e) => {
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

      setName(""); setEmail(""); setPhone(""); setDate(""); setTime(""); setItems("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-3 text-center">Book Your Slot</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded text-sm" />
        <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded text-sm" />
        <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded text-sm" />
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} required className="border p-2 rounded text-sm" />

        <select value={time} onChange={(e) => setTime(e.target.value)} required className="border p-2 rounded text-sm">
          <option value="">{date ? "Time *" : "Select date first"}</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="number"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          min="1"
          max={time === "4:00 PM" ? 30 : 80}
          required
          className="border p-2 rounded text-sm"
          placeholder={time === "4:00 PM" ? "Number of Items (max 30 at 4 PM) *" : "Number of Items *"}
        />
      </div>

      <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-1.5 mt-3 rounded text-sm hover:bg-blue-700 disabled:opacity-60">
        {submitting ? "Saving..." : "Confirm"}
      </button>
    </form>
  );
}

export default BookingForm;