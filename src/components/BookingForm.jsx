import React, { useState } from "react";

function BookingForm({ addBooking }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !date || !time || !items) {
      alert("❌ Please complete all fields.");
      return;
    }

    addBooking({ name, email, date, time, items: parseInt(items) });

    // Reset form
    setName("");
    setEmail("");
    setDate("");
    setTime("");
    setItems(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Book Your Slot</h2>

      <label className="block mb-2">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full border p-2 rounded mb-4"
      />

      <label className="block mb-2">Time Slot</label>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">Select Time</option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="11:00 AM">11:00 AM</option>
        <option value="12:00 PM">12:00 PM</option>
        <option value="1:00 PM">1:00 PM</option>
        <option value="2:00 PM">2:00 PM</option>
        <option value="3:00 PM">3:00 PM</option>
        <option value="4:00 PM">4:00 PM</option>
      </select>

      <label className="block mb-2">Number of Items</label>
      <input
        type="number"
        value={items}
        onChange={(e) => setItems(e.target.value)}
        min="1"
        max="80"
        required
        className="w-full border p-2 rounded mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </form>
  );
}

export default BookingForm;