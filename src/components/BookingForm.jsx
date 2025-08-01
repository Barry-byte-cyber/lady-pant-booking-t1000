import React, { useState } from "react";

function BookingForm({ addBooking }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    items: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      name: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      items: Number(formData.items),
    };

    addBooking(newBooking);

    setFormData({
      name: "",
      email: "",
      date: "",
      time: "",
      items: 1,
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Book Your Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        {/* 🔹 Time Slot Dropdown */}
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Time Slot --</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="4:00 PM">4:00 PM</option>
        </select>

        <input
          type="number"
          name="items"
          min="1"
          value={formData.items}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;