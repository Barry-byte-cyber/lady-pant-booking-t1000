import emailjs from "@emailjs/browser";

/**
 * Sends a booking confirmation via EmailJS.
 * Won’t break the app if EmailJS fails.
 */
export async function sendConfirmationEmail({
  toEmail,
  toName,
  date,
  time,
  items,
  phone,
  email, // reply-to
}) {
  if (import.meta.env.VITE_EMAILJS_ENABLED !== "true") {
    return { ok: true, skipped: true };
  }

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const templateParams = {
    to_name: toName || "there",
    to_email: toEmail,
    booking_date: date,
    booking_time: time,
    booking_items: String(items ?? ""),
    phone: phone || "",
    email: email || toEmail, // reply-to
  };

  const res = await emailjs.send(serviceId, templateId, templateParams, {
    publicKey,
  });

  return { ok: true, res };
}