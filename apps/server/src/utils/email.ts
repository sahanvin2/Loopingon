import nodemailer from "nodemailer";
import { logger } from "../middleware/errorHandler.middleware.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
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
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";

  if (!smtpUser || !smtpPass) {
    logger.warn(`SMTP not configured — skipping email to ${to}`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || "no-reply@movia.club",
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
