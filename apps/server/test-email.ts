import dotenv from "dotenv";
import { resolve } from "path";
import { sendEmail } from "./src/utils/email.js";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env") });

async function main() {
  console.log("Testing SMTP Configuration...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_FROM:", process.env.SMTP_FROM);

  const testEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center; color: white;">
        <h2>Kandyam System Update</h2>
      </div>
      <div style="padding: 20px; color: #333; line-height: 1.6;">
        <p>Hello Admin,</p>
        <p>If you are seeing this email, it means your Brevo SMTP integration is working perfectly!</p>
        <p>We've successfully updated your system to use the new credentials for:</p>
        <ul>
          <li>Order Confirmations</li>
          <li>Abandoned Cart Reminders</li>
          <li>User & Seller Welcome Emails</li>
        </ul>
        <p>Best regards,<br>Your AI Assistant</p>
      </div>
    </div>
  `;

  try {
    await sendEmail(
      "snawarathne10@gmail.com",
      "SMTP Setup Successful - Kandyam",
      testEmailHtml
    );
    console.log("✅ Test email sent successfully to snawarathne10@gmail.com");
  } catch (error) {
    console.error("❌ Failed to send test email:");
    console.error(error);
  }
}

main();
