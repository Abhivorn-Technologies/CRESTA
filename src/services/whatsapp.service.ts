export async function sendWhatsAppMessage(phone: string, message: string) {
  const normalizedPhone = phone.replace("+91", "").trim();
  console.log(`\n=========================================`);
  console.log(`📲 WHATSAPP MESSAGE TO ${normalizedPhone}:`);
  console.log(message);
  console.log(`=========================================\n`);
  return true;
}

export async function sendOrderPlacedWhatsApp(phone: string, orderId: string, totalAmount: number) {
  const message = `🛍️ *Order Received!* 🛍️\n\nHi there! We have successfully received your order (*#${orderId.toString().slice(-6).toUpperCase()}*) for ₹${totalAmount.toFixed(2)}.\n\nWe are currently processing it and will update you once it's out for delivery.\n\nThank you for choosing Cresta Global! 🍦`;
  return sendWhatsAppMessage(phone, message);
}

export async function sendOrderDeliveredWhatsApp(phone: string, orderId: string) {
  const message = `✅ *Order Delivered!* ✅\n\nGreat news! Your order (*#${orderId.toString().slice(-6).toUpperCase()}*) has been successfully delivered.\n\nWe hope you enjoy your premium desserts! 😋 If you have any feedback, reply to this message.\n\nThank you for choosing Cresta Global! 🍦`;
  return sendWhatsAppMessage(phone, message);
}
