import emailjs from "@emailjs/browser";

// Single place to send confirmation emails from Client + Admin views
export async function sendConfirmationEmail({
  toEmail,
  toName,
  date,
  time,
  items,
  phone,
  email, // reply-to
}) {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("[EmailJS] Missing env keys. Check your env.local.");
      return false;
    }

    const templateParams = {
      to_email: toEmail,
      to_name : toName,
      booking_date : date,
      booking_time : time,
      booking_items: items,
      phone,
      email, // reply-to
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("✅ Confirmation email sent to:", toEmail);
    return true;
  } catch (err) {
    console.error("❌ EmailJS send failed:", err);
    return false;
  }
}