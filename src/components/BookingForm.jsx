import React, { useState } from "react";

function BookingForm({ addBooking }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState("");

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
    setItems("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-bold mb-3 text-center">Book Your Slot</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded text-sm"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded text-sm"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-2 rounded text-sm col-span-1"
        />

        <div className="col-span-1">
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="border p-2 rounded text-sm w-full"
          >
            <option value="">Time</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
          </select>
          {/* Special Note for 4PM */}
          {time === "4:00 PM" && (
            <p className="text-xs text-red-600 mt-1">⚠️ 30 items maximum</p>
          )}
        </div>

        <div className="col-span-2 text-left">
          {/* Dynamic Title */}
          {items && (
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Number of Items
            </label>
          )}
          <input
            type="number"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            min="1"
            max="80"
            required
            className="border p-2 rounded text-sm w-full"
            placeholder="Number of Items"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-1.5 mt-3 rounded text-sm hover:bg-blue-700"
      >
        Confirm
      </button>
    </form>
  );
}

export default BookingForm;