import { sendEmail } from "./src/config/email.js";
import { prisma } from "./src/config/database.js";

async function run() {
  console.log("Directly sending test email...");
  
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { images: true },
      take: 6,
    });
    
    // We will just send a simple HTML first to confirm if the SMTP works.
    const success = await sendEmail({
      to: "snawarathne10@gmail.com",
      subject: "Test Direct Email from Kandyam",
      html: `
        <div style="padding: 20px; font-family: sans-serif;">
          <h1 style="color: #F7444E;">Kandyam Direct Test</h1>
          <p>This is a direct test email to check if the SMTP relay is working correctly.</p>
          <p>If you received this, the configuration is working.</p>
        </div>
      `
    });

    if (success) {
      console.log("sendEmail returned true. The SMTP server accepted the email.");
    } else {
      console.error("sendEmail returned false. Check SMTP credentials or limits.");
    }
    
  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    process.exit(0);
  }
}

run();
