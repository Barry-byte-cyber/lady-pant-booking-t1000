import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { TIMES } from "../App";
import { sendConfirmationEmail } from "../utils/emailHelper";

// Robust import: works whether calendarRules exports named or default
import * as rules from "../config/calendarRules";
const isClosedDay = (d) => {
  const fn = rules.isBlockedDate ?? rules.default;
  return typeof fn === "function" ? fn(d) === true : false;
};

const DAY_CAP = 100;

// --- utilities ---
function timeLabelToMinutes(label) {
  // e.g. "10:30 AM" -> minutes since 00:00
  const [hm, ap] = label.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

export default function BookingForm({ bookings = [], addBooking, getTakenTimes }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // {type: 'success'|'error', text: string}

  // availability
  const takenTimes = useMemo(
    () => (date ? getTakenTimes?.(date) ?? new Set() : new Set()),
    [getTakenTimes, date]
  );
  const availableTimes = useMemo(
    () => (date ? TIMES.filter((t) => !takenTimes.has(t)) : TIMES),
    [date, takenTimes]
  );

  const totalItemsForDate = useMemo(() => {
    if (!date) return 0;
    return bookings
      .filter((b) => b.date === date)
      .reduce((sum, b) => sum + (Number(b.items) || 0), 0);
  }, [bookings, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);

    // required
    if (!name || !email || !date || !time || !items) {
      alert("Please complete all required fields.");
      return;
    }

    const d = dayjs(date, "YYYY-MM-DD");
    try {
      if (isClosedDay(d)) {
        alert("We’re closed on that date. Please choose another date.");
        return;
      }
    } catch (err) {
      // if rules import/export mismatched, don’t kill booking
      console.error("Closed-day check failed; treating day as open:", err);
    }

    // numeric items
    const itemsNum = Number(items);
    if (!Number.isFinite(itemsNum) || itemsNum <= 0) {
      alert("Items must be a positive number.");
      return;
    }

    // caps & rules
    // 4:00 PM max 30
    if (time === "4:00 PM" && itemsNum > 30) {
      alert("4:00 PM slot allows a maximum of 30 items.");
      return;
    }

    // >60 items must be booked before 11:00 AM
    if (itemsNum > 60) {
      const tMins = timeLabelToMinutes(time);
      const eleven = timeLabelToMinutes("11:00 AM");
      if (tMins >= eleven) {
        alert("Bookings over 60 items must be scheduled before 11:00 AM.");
        return;
      }
    }

    // daily cap
    const totalAfter = totalItemsForDate + itemsNum;
    if (totalAfter > DAY_CAP) {
      alert(`Day is full (${totalItemsForDate}/${DAY_CAP}). Please choose another date.`);
      return;
    }

    setSubmitting(true);
    try {
      // persist the booking
      addBooking({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: (phone || "").trim(),
        date,
        time,
        items: itemsNum,
      });

      // send email (non-blocking UX)
      try {
        await sendConfirmationEmail({
          toEmail: email.trim().toLowerCase(),
          toName: name.trim(),
          date,
          time,
          items: itemsNum,
          phone: (phone || "").trim(),
          email: email.trim().toLowerCase(), // reply-to
        });
        setBanner({ type: "success", text: "✅ Confirmation email sent." });
      } catch (err) {
        console.error("Confirmation email failed (non‑blocking):", err);
        setBanner({ type: "error", text: "⚠️ Booking saved, but email failed." });
      }

      // reset (keep date if you prefer)
      setName("");
      setEmail("");
      setPhone("");
      setItems("");
      setTime("");
    } catch (err) {
      console.error("addBooking threw:", err);
      alert("Sorry, we couldn’t save that booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {banner && (
        <div
          className={`rounded-md p-2 text-sm ${
            banner.type === "success" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {banner.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded text-sm"
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded text-sm"
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          className="border p-2 rounded text-sm"
        />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded text-sm"
          required
        >
          <option value="">{date ? "Time *" : "Select date first"}</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder={time === "4:00 PM" ? "Items * (max 30 at 4 PM)" : "Items *"}
          value={items}
          onChange={(e) => setItems(e.target.value)}
          min="1"
          max={time === "4:00 PM" ? 30 : 100}
          className="border p-2 rounded text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Confirm"}
      </button>
    </form>
  );
}