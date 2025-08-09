import React from "react";

const AdminBookingForm = ({ formData, setFormData, handleBooking }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-4 sticky top-0 z-10">
      <h2 className="text-xl font-bold mb-4">📝 Book Your Slot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Time</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="4:00 PM">4:00 PM</option>
        </select>
        <input
          type="number"
          min="1"
          value={formData.items}
          onChange={(e) => setFormData({ ...formData, items: e.target.value })}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white mt-4 px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default AdminBookingForm;