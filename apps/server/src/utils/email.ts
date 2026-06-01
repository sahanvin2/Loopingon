import nodemailer from "nodemailer";
import { logger } from "../middleware/errorHandler.middleware.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || "noreply@loopingon.com",
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`, { subject });
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, error);
    throw error;
  }
}
