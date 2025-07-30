import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

function App() {
  const [allBookings, setAllBookings] = useState(() => {
    const stored = localStorage.getItem("bookings");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever bookings update
  const saveBookings = (newBookings) => {
    setAllBookings(newBookings);
    localStorage.setItem("bookings", JSON.stringify(newBookings));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigation */}
        <nav className="flex gap-6 p-4 bg-gray-200 shadow-md">
          <Link to="/" className="hover:underline">
            Client Booking
          </Link>
          <Link to="/calendar" className="hover:underline">
            Calendar
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <BookingForm bookings={allBookings} setBookings={saveBookings} />
            }
          />
          <Route
            path="/calendar"
            element={
              <CalendarView bookings={allBookings} setBookings={saveBookings} />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminView allBookings={allBookings} setBookings={saveBookings} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;