import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import AdminLogin from './components/AdminLogin';
import AdminView from './components/AdminView';
import CalendarView from './components/CalendarView';

function App() {
  const [bookings, setBookings] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(storedBookings);
  }, []);

  const handleAddBooking = (newBooking) => {
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const handleCancelBooking = (cancelId) => {
    const updatedBookings = bookings.filter(booking => booking.id !== cancelId);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/" element={<BookingForm onAddBooking={handleAddBooking} />} />
          <Route path="/calendar" element={<CalendarView bookings={bookings} />} />
          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? (
                <AdminView
                  allBookings={bookings}
                  onLogout={() => setIsAdminLoggedIn(false)}
                />
              ) : (
                <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;