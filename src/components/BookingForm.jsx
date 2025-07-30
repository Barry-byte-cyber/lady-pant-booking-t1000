import React, { useState } from "react";

function BookingForm({ bookings, setBookings }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    formData.name.trim() === "" ||
    formData.email.trim() === "" ||
    formData.date.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const newBookings = [...bookings, formData];
  setBookings(newBookings);

  setFormData({ name: "", email: "", date: "", quantity: 1 });
};

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Book Your Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          min="1"
          max="80"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;