// src/config/calendarRules.js
import dayjs from "dayjs";

// List of Alberta Statutory Holidays for 2025
export const ALBERTA_STAT_HOLIDAYS_2025 = new Set([
  "2025-01-01", // New Year's Day
  "2025-02-17", // Family Day
  "2025-04-18", // Good Friday
  "2025-05-19", // Victoria Day
  "2025-07-01", // Canada Day
  "2025-09-01", // Labour Day
  "2025-10-13", // Thanksgiving Day
  "2025-11-11", // Remembrance Day
  "2025-12-25", // Christmas Day
]);

// Helper to check Sundays
export function isSunday(yyyyMmDd) {
  const d = dayjs(yyyyMmDd);
  return d.isValid() && d.day() === 0;
}

// Helper to check Alberta holidays
export function isAlbertaHoliday(yyyyMmDd) {
  if (!yyyyMmDd) return false;
  const y = yyyyMmDd.slice(0, 4);
  if (y !== "2025") return false;
  return ALBERTA_STAT_HOLIDAYS_2025.has(yyyyMmDd);
}

// Main function: returns true if date is blocked (Sunday or holiday)
export function isBlockedDate(yyyyMmDd) {
  return isSunday(yyyyMmDd) || isAlbertaHoliday(yyyyMmDd);
}