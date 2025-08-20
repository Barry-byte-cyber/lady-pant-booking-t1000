import React, { useEffect, useMemo, useState } from "react";
import { TIMES } from "../App";
import { isBlockedDate } from "../config/calendarRules.js";

const DAY_CAP = 100;
const FOUR_PM = "4:00 PM";
const FOUR_PM_CAP = 30;

export default function BookingForm({ addBooking, bookings, getTakenTimes }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [items, setItems] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---- Closed days (Sunday/AB holiday) ----
  const dateError = useMemo(() => {
    if (!date) return "";
    return isBlockedDate(date) ? "Closed (Sunday or Stat Holiday)" : "";
  }, [date]);

  const numericItems = Number(items || 0);
  const isHeavy = numericItems > 60;

  // Sum items already booked for the selected date
  const totalItemsAlreadyBooked = useMemo(() => {
    if (!date || !bookings?.length) return 0;
    return bookings
      .filter((b) => b?.date === date)
      .reduce((sum, b) => sum + Number(b?.items || 0), 0);
  }, [bookings, date]);

  const remainingToday = Math.max(0, DAY_CAP - totalItemsAlreadyBooked);
  const dayIsFull = remainingToday === 0;

  // Reset time when date changes
  useEffect(() => setTime(""), [date]);

  // Times already taken (your existing helper)
  const takenTimes = useMemo(
    () => (getTakenTimes ? getTakenTimes(date) : new Set()),
    [getTakenTimes, date]
  );

  // Available times: remove taken; if heavy, only allow 10:30 AM
  const availableTimes = useMemo(() => {
    let base = TIMES.filter((t) => !takenTimes.has(t));
    if (isHeavy) {
      base = base.filter((t) => t === "10:30 AM");
    }
    return base;
  }, [takenTimes, isHeavy]);

  // ---- Validation messages / guards ----
  const overDayCap =
    !!date &&
    !!numericItems &&
    totalItemsAlreadyBooked + numericItems > DAY_CAP;

  const fourPmOverCap = time === FOUR_PM && numericItems > FOUR_PM_CAP;

  const heavyWrongTime = isHeavy && !!time && time !== "10:30 AM";

  // Build a user-facing message (first one that applies)
  const blockingMessage = (() => {
    if (dateError) return dateError;
    if (dayIsFull) return `Day is full (${DAY_CAP}/${DAY_CAP}). Please choose another date.`;
    if (overDayCap) {
      const maxYouCanBook = Math.max(0, DAY_CAP - totalItemsAlreadyBooked);
      return `This would exceed today's cap (${totalItemsAlreadyBooked}/${DAY_CAP}). You can book up to ${maxYouCanBook} items for this day.`;
    }
    if (fourPmOverCap) return `At ${FOUR_PM} the limit is ${FOUR_PM_CAP} items.`;
    if (heavyWrongTime) return "Bookings over 60 items must be at 10:30 AM.";
    return "";
  })();

  const disableTime = !date || !!dateError || dayIsFull;
  const disableItems = !!dateError || dayIsFull;
  const disableConfirm =
    submitting ||
    !!dateError ||
    dayIsFull ||
    overDayCap ||
    fourPmOverCap ||
    heavyWrongTime;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !date || !time || !items) {
      alert("❌ Please complete all required fields.");
      return;
    }
    if (blockingMessage) {
      alert(`❌ ${blockingMessage}`);
      return;
    }

    setSubmitting(true);
    try {
      addBooking({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date,
        time,
        items: parseInt(items, 10),
      });

      // reset (keep date if you prefer)
      setName("");
      setEmail("");
      setPhone("");
      setItems("");
      setTime("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded text-sm"
          required
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded text-sm"
        />

        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={[
              "border p-2 rounded text-sm w-full",
              dateError ? "border-red-500" : "",
            ].join(" ")}
            required
          />
          {/* Remaining hint */}
          {date && !dateError && !dayIsFull ? (
            <p className="mt-1 text-xs text-gray-600">
              Remaining today: <b>{remainingToday}</b> items
            </p>
          ) : null}
          {/* Blocking message for full/closed */}
          {blockingMessage && (dateError || dayIsFull) ? (
            <p className="mt-1 text-xs text-red-600">{blockingMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded text-sm w-full"
            required
            disabled={disableTime}
          >
            <option value="">{date ? "Time *" : "Select date first"}</option>
            {availableTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Time-related warnings */}
          {blockingMessage && !dateError && !dayIsFull && (fourPmOverCap || heavyWrongTime) ? (
            <p className="mt-1 text-xs text-red-600">{blockingMessage}</p>
          ) : null}
        </div>

        <div>
          <input
            type="number"
            placeholder="Number of Items *"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            min="1"
            // Soft cap in the UI: don't let user type more than remaining or 30 at 4 PM
            max={
              time === FOUR_PM
                ? Math.min(FOUR_PM_CAP, remainingToday)
                : remainingToday
            }
            className="border p-2 rounded text-sm w-full"
            required
            disabled={disableItems}
          />
          {/* Over-day-cap warning when date/time chosen */}
          {blockingMessage && !dateError && !dayIsFull && overDayCap ? (
            <p className="mt-1 text-xs text-red-600">{blockingMessage}</p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={disableConfirm}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Confirm"}
      </button>
    </form>
  );
}