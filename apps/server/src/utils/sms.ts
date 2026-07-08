import { logger } from "../middleware/errorHandler.middleware.js";

interface SendSMSParams {
  recipient: string;
  message: string;
}

export async function sendSMS({ recipient, message }: SendSMSParams): Promise<boolean> {
  const token = process.env.TEXTLK_API_TOKEN;
  if (!token) {
    logger.warn("TEXTLK_API_TOKEN is not configured. SMS not sent.");
    return false;
  }

  // Ensure recipient is in the correct format (remove leading zero, prefix with 94 for Sri Lanka)
  let formattedRecipient = recipient.replace(/\D/g, ""); // Remove non-digits
  if (formattedRecipient.startsWith("0")) {
    formattedRecipient = "94" + formattedRecipient.substring(1);
  } else if (!formattedRecipient.startsWith("94") && formattedRecipient.length === 9) {
    formattedRecipient = "94" + formattedRecipient;
  }

  try {
    const response = await fetch("https://app.text.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        recipient: formattedRecipient,
        sender_id: "kandyam",
        type: "plain",
        message,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok || data.status === "error") {
      logger.error(`Failed to send SMS to ${formattedRecipient}: ${data.message || response.statusText}`);
      return false;
    }

    logger.info(`SMS sent successfully to ${formattedRecipient}`);
    return true;
  } catch (error) {
    logger.error(`Error sending SMS to ${formattedRecipient}`, error);
    return false;
  }
}

export async function sendAdminOrderNotification(orderNumber: string, amount: number, itemCount: number) {
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  if (!adminPhone) {
    logger.warn("ADMIN_PHONE_NUMBER is not configured. Admin SMS not sent.");
    return false;
  }

  const message = `Kandyam: New Order #${orderNumber}! Total: LKR ${amount.toLocaleString()}. ${itemCount} item(s). Check dashboard.`;
  return sendSMS({ recipient: adminPhone, message });
}

export async function sendCustomerOrderSMS(
  phone: string,
  orderNumber: string,
  amount: number,
  customerName?: string,
  itemNames?: string[],
) {
  const name = customerName || "there";
  const itemText = itemNames && itemNames.length > 0
    ? itemNames.slice(0, 2).join(", ") + (itemNames.length > 2 ? ` +${itemNames.length - 2} more` : "")
    : "your items";

  const message = `Hi ${name}! Your Kandyam order #${orderNumber} is confirmed.\n\nItems: ${itemText}\nTotal Paid: Rs. ${amount.toLocaleString()}\n\nYour digital products are ready to download in your dashboard.\n\nThank you for shopping with Kandyam!`;
  return sendSMS({ recipient: phone, message });
}
