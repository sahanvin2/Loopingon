import dotenv from "dotenv";
import { resolve } from "path";
import { sendAdminOrderNotification } from "./src/utils/sms.js";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env") });

async function main() {
  console.log("Testing SMS Gateway (text.lk)...");
  
  const token = process.env.TEXTLK_API_TOKEN;
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  
  if (!token) {
    console.error("❌ Error: TEXTLK_API_TOKEN is not set in .env");
    process.exit(1);
  }
  
  if (!adminPhone) {
    console.error("❌ Error: ADMIN_PHONE_NUMBER is not set in .env");
    process.exit(1);
  }

  console.log(`Admin Phone: ${adminPhone}`);
  console.log("Sending test SMS for a fake order #TEST-001...");

  // Send a test order notification
  const success = await sendAdminOrderNotification("TEST-001", 12500, 3);
  
  if (success) {
    console.log("✅ Test SMS dispatched successfully!");
  } else {
    console.log("❌ Failed to dispatch test SMS. Check logs.");
  }
}

main();
