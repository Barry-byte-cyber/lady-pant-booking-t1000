import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

/** Public export – AdminView imports this */
export const TIMES = [
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];
const STORAGE_KEY = "lady-pant-t1000-bookings";

/** Orange test banner */
function TestBanner() {
  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-white text-center text-sm py-2">
      <b>TEST MODE</b> — Demo sandbox. Data is local to this browser and may be cleared.
      Emails are live for confirmations.
    </div>
  );
}

/** Shell nav */
function TopNav() {
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded ${
        pathname === to ? "bg-white text-gray-900" : "text-white/90 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-800 text-white py-4 flex justify-between px-4">
      <div className="font-semibold">Lady Pant Store Booking</div>
      <div className="space-x-2">{link("/", "Client View")}{link("/admin", "Admin View")}</div>
    </nav>
  );
}

/** Root app */
export default function App() {
  const [bookings, setBookings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  // util: compute taken times for a given YYYY-MM-DD date
  const getTakenTimes = (date) => {
    if (!date) return new Set();
    const set = new Set(
      bookings.filter((b) => b.date === date).map((b) => b.time).filter(Boolean)
    );
    return set;
  };

  // add booking
  const addBooking = (b) => {
    const id = cryptoRandom();
    setBookings((prev) => [...prev, { ...b, id }]);
  };

  // cancel booking
  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BrowserRouter>
      <TopNav />
      <TestBanner />
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <ClientView
                bookings={bookings}
                addBooking={addBooking}
                cancelBooking={cancelBooking}
                getTakenTimes={getTakenTimes}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminView
                bookings={bookings}
                addBooking={addBooking}
                cancelBooking={cancelBooking}
                getTakenTimes={getTakenTimes}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

/** ===== Client View (left 2/3, right 1/3 sticky calendar) ===== */
function ClientView({ bookings, addBooking, cancelBooking, getTakenTimes }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [emailLookup, setEmailLookup] = useState("");

  const normalizedLookup = emailLookup.trim().toLowerCase();
  const myBookings = useMemo(
    () =>
      normalizedLookup
        ? bookings
            .filter((b) => (b.email || "").toLowerCase() === normalizedLookup)
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        : [],
    [bookings, normalizedLookup]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* LEFT (2/3): red note + Do’s & Don’ts + booking form + lookup */}
      <div className="lg:col-span-2 space-y-4">
        {/* Red note banner (nudged: slightly smaller padding so it visually aligns with cards) */}
        <div className="bg-red-600 border border-red-700 text-white rounded-lg p-3">
          <p className="text-sm leading-relaxed">
            <span className="font-bold">Note:</span> Clients require an{" "}
            <span className="font-semibold">Account number</span> to book store
            appointments online. If you're a first-time consignor, please call us at{" "}
            <span className="font-semibold">403-000-0000</span>. We’ll set you up with an
            account for future consignments.{" "}
            <span className="font-semibold">Store Hours:</span> Monday to Saturday 10am to 6 pm.
          </p>
        </div>

        {/* Row: Do’s & Don’ts + Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Do’s and Don’ts */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Do’s and Don’ts</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Bring freshly laundered, folded items in a bag or bin.</li>
              <li>Limit perfumes/scents on garments; no strong odors.</li>
              <li>Check for stains, missing buttons, and broken zippers.</li>
              <li>Ensure all items are not on the Unacceptable Brand List.</li>
              <li>Accurate count of items is important for time efficiency.</li>
              <li>
                If you have any questions please call us at the store during business hours
                or contact us via email, Facebook, or Instagram.
              </li>
            </ul>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow p-4">
            <BookingForm
              addBooking={(b) => addBooking(b)}
              bookings={bookings}
              getTakenTimes={getTakenTimes}
            />
          </div>
        </div>

        {/* Find & Cancel My Bookings */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Find &amp; Cancel My Bookings</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={emailLookup}
            onChange={(e) => setEmailLookup(e.target.value)}
            className="border p-2 rounded text-sm w-full mb-3"
          />
          {normalizedLookup ? (
            myBookings.length > 0 ? (
              <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                {myBookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-2 rounded gap-1"
                  >
                    <span className="text-sm">
                      <span className="font-medium">{b.date}</span> — {b.time} — {b.items} items{" "}
                      {b.phone ? `— 📞 ${b.phone}` : ""}
                    </span>
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 self-start sm:self-center"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No bookings found for that email.</p>
            )
          ) : (
            <p className="text-sm text-gray-600">Enter your email to see all your bookings.</p>
          )}
        </div>
      </div>

      {/* RIGHT (1/3): sticky, scrollable calendar sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="bg-white rounded-lg shadow p-3 h-[calc(100vh-160px)] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Booking Calendar</h3>
            <CalendarView bookings={bookings} onDateClick={setSelectedDate} sidebar />
          </div>
        </div>
      </aside>
    </div>
  );
}
/** util: crypto-safe-ish id (works in browsers without Node crypto) */
function cryptoRandom() {
  try {
    const a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return [...a].map((n) => n.toString(16).padStart(8, "0")).join("");
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}