import React, { useState } from "react";

function BookingForm({ addBooking }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.date) {
      alert("Please fill in all fields.");
      return;
    }

    // Ensure quantity is at least 1
    const booking = {
      ...form,
      quantity: Number(form.quantity) || 1,
    };

    addBooking(booking);

    // Reset form
    setForm({
      name: "",
      email: "",
      date: "",
      quantity: 1,
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Book Your Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="1"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;