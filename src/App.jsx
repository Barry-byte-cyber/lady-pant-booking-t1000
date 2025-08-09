import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

function TestBanner() {
  const testMode =
    (import.meta.env.VITE_TEST_MODE ?? "1") === "1"; // default ON for demos
  if (!testMode) return null;
  return (
    <div className="sticky top-0 z-50">
      <div className="w-full bg-amber-500 text-white text-sm text-center px-3 py-2">
        <strong>TEST MODE</strong> — Demo sandbox. Data is local to this browser and may be cleared.
        Emails are live for confirmations.
      </div>
    </div>
  );
}
/** Shared time options */
export const TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM", // special: max 30 items
];

/** Tiny banner to show email status during testing */
function EmailStatus({ status }) {
  if (!status) return null;
  return (
    <div
      className={`text-xs px-2 py-1 rounded mb-2 ${
        status.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
      }`}
    >
      {status.message}
    </div>
  );
}

/** Client View: sticky two-column header (form left, note + lookup right) */
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
    <div>
      {/* Sticky header */}
      <div className="sticky top-12 z-20 bg-gray-50 shadow-md rounded-lg mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* LEFT: Booking form */}
          <div className="order-1 lg:order-none">
            <BookingForm
              addBooking={(b) => addBooking(b)}
              bookings={bookings}
              getTakenTimes={getTakenTimes}
            />
          </div>

          {/* RIGHT: account note + lookup */}
          <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                <span className="font-bold">Note:</span> Clients require an{" "}
                <span className="font-semibold">Account number</span> to book
                store appointments online. If you're a first-time consignor,
                please call us at <span className="font-semibold">403-000-000</span>.
                We’ll set you up with an account for future consignments.
              </p>
            </div>

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
                <p className="text-sm text-gray-600">
                  Enter your email to see all your bookings.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <h2 className="text-xl font-bold mt-2 mb-2">Booking Calendar (2025)</h2>
      <CalendarView bookings={bookings} onDateClick={setSelectedDate} />

      {/* Optional: date-click details (read-only) */}
      {selectedDate && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
          <h3 className="font-semibold">
            Bookings on <span className="underline">{selectedDate}</span>
          </h3>
          <ul className="mt-2 space-y-2">
            {bookings
              .filter((b) => b.date === selectedDate)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:justify-between bg-gray-100 p-2 rounded"
                >
                  <span>
                    <span className="font-medium">{b.time}</span> — {b.name} — {b.items} items{" "}
                    {b.phone ? `— 📞 ${b.phone}` : ""}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  const [bookings, setBookings] = useState([]);
  const [emailStatus, setEmailStatus] = useState(null); // { ok:boolean, message:string }

  // Init EmailJS (ok to keep even though we pass key to send())
  useEffect(() => {
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (PUBLIC_KEY) {
      try {
        emailjs.init(PUBLIC_KEY);
      } catch (e) {
        console.warn("[EmailJS] init failed", e);
      }
    }
  }, []);

  // Load/save local storage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(stored);
  }, []);
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  /** Helpers */
  const normalizeBooking = (raw) => ({
    ...raw,
    name: (raw.name || "").trim(),
    email: (raw.email || "").trim().toLowerCase(),
    phone: (raw.phone || "").trim(),
    date: (raw.date || "").trim(),
    time: (raw.time || "").trim(),
    items: parseInt(raw.items || 0, 10),
  });

  /** Times already taken for a given date (to hide from dropdowns) */
  const getTakenTimes = (date) => {
    if (!date) return new Set();
    const set = new Set();
    bookings.forEach((b) => {
      if ((b.date || "").trim() === date.trim()) set.add((b.time || "").trim());
    });
    return set;
  };

  /** Send confirmation email — matches your EmailJS template */
  async function sendConfirmationEmail(booking) {
  const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID || "").trim();
  const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "").trim();
  const PUBLIC_KEY  = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "").trim();

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    setEmailStatus({ ok: false, message: "Email skipped: env vars not set." });
    return;
  }

  console.log(
  `[EmailJS] Using SERVICE=${SERVICE_ID} TEMPLATE=${TEMPLATE_ID} ` +
  `KEYlen=${PUBLIC_KEY.length} head=${PUBLIC_KEY.slice(0,4)} tail=${PUBLIC_KEY.slice(-4)}`
);

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: booking.email,
        to_name: booking.name || "Consignor",
        booking_date: booking.date,
        booking_time: booking.time,
        booking_items: String(booking.items || ""),
        phone: booking.phone || "",
        booking_id: String(booking.id)
      },
      { publicKey: PUBLIC_KEY } // pass key explicitly (safe across versions)
    );
    setEmailStatus({ ok: true, message: `Email sent to ${booking.email}` });
  } catch (err) {
    console.warn("[EmailJS] Send failed:", err?.status, err?.text, err);
    setEmailStatus({
      ok: false,
      message: `Email failed (${err?.status ?? "?"} ${err?.text ?? ""}). Check console.`,
    });
  }
}
  /**
   * Rules:
   * - Max 80 items per day for any date
   * - ONLY 4:00 PM has a per-slot max of 30 items
   * - No double booking: once a {date,time} is used, it cannot be booked again (and is hidden)
   */
  const addBooking = (rawBooking) => {
    const booking = normalizeBooking(rawBooking);

    // No double bookings
    const slotTaken = bookings.some(
      (b) => (b.date || "").trim() === booking.date && (b.time || "").trim() === booking.time
    );
    if (slotTaken) {
      alert("❌ That time is already booked for this date.");
      return;
    }

    // Day cap 80
    const dayTotal = bookings
      .filter((b) => (b.date || "").trim() === booking.date)
      .reduce((sum, b) => sum + parseInt(b.items || 0, 10), 0);
    if (dayTotal + booking.items > 80) {
      alert("❌ Booking limit reached: Maximum 80 items per day.");
      return;
    }

    // 4:00 PM special 30-item single booking cap
    if (booking.time === "4:00 PM" && booking.items > 30) {
      alert("❌ 4:00 PM limit: Maximum 30 items for this slot.");
      return;
    }

    const bookingWithId = { ...booking, id: Date.now() };
    setBookings((prev) => [...prev, bookingWithId]);
    sendConfirmationEmail(bookingWithId); // fire-and-forget
  };

  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    // (Optional) send cancellation email here
  };

  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <div className="font-bold">Lady Pant Store Booking</div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">Client View</Link></li>
          <li><Link to="/admin" className="hover:underline">Admin View</Link></li>
        </ul>
      </nav>
      <TestBanner />
      <div className="p-6">
        <EmailStatus status={emailStatus} />
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
      </div>
    </Router>
  );
}

export default App;