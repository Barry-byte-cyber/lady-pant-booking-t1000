import React, { useState } from 'react';

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quantity: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.quantity && formData.date) {
      onSubmit(formData);
      setFormData({ name: '', email: '', quantity: '', date: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">Book Your Drop-Off</h2>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        className="border p-2 w-full mb-2"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className="border p-2 w-full mb-2"
        type="number"
        name="quantity"
        placeholder="Item Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <input
        className="border p-2 w-full mb-2"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Booking
      </button>
    </form>
  );
};

export default BookingForm;