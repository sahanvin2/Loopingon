import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { sendEmail } from "../config/email.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "email";

interface VerificationEmailJob {
  type: "sendVerificationEmail";
  data: { email: string; token: string; name?: string };
}

interface PasswordResetEmailJob {
  type: "sendPasswordResetEmail";
  data: { email: string; token: string; name?: string };
}

interface OrderConfirmationJob {
  type: "sendOrderConfirmation";
  data: {
    email: string;
    name?: string;
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress?: string;
    estimatedDelivery?: string;
  };
}

interface ShippingUpdateJob {
  type: "sendShippingUpdate";
  data: {
    email: string;
    name?: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl?: string;
    courierName?: string;
    status: string;
    estimatedDelivery?: string;
  };
}

interface WelcomeEmailJob {
  type: "sendWelcomeEmail";
  data: { email: string; name?: string };
}

type EmailJobData =
  | VerificationEmailJob
  | PasswordResetEmailJob
  | OrderConfirmationJob
  | ShippingUpdateJob
  | WelcomeEmailJob;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PLATFORM_NAME = process.env.PLATFORM_NAME || "Loopingon";

function emailTemplate(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">${PLATFORM_NAME}</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0 0;">Where Sri Lankan Craft Meets the World</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:24px 40px;border-top:1px solid #e9ecef;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#6c757d;font-size:12px;line-height:1.6;">
                    <p style="margin:0 0 8px 0;">This email was sent by ${PLATFORM_NAME}.</p>
                    <p style="margin:0 0 8px 0;">Need help? Contact us at <a href="mailto:support@loopingon.com" style="color:#4F46E5;text-decoration:none;">support@loopingon.com</a></p>
                    <p style="margin:0;color:#adb5bd;">&copy; ${new Date().getFullYear()} ${PLATFORM_NAME}. All rights reserved.</p>
                  </td>
                  <td align="right">
                    <a href="${FRONTEND_URL}" style="display:inline-block;margin-left:12px;text-decoration:none;">
                      <img src="${FRONTEND_URL}/logo-small.png" alt="${PLATFORM_NAME}" width="40" height="40" style="border-radius:8px;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildVerificationHtml(name: string | undefined, token: string): string {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  const greeting = name ? `Hello ${name},` : "Hello,";

  return emailTemplate(
    "Verify Your Email",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px 0;">Verify Your Email Address</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">Thank you for joining ${PLATFORM_NAME}. Please verify your email address by clicking the button below to activate your account.</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:8px 0 32px 0;">
          <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Verify Email Address</a>
        </td>
      </tr>
    </table>
    <p style="color:#6c757d;font-size:14px;line-height:1.6;margin:0 0 8px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="color:#4F46E5;font-size:13px;line-height:1.6;margin:0 0 24px 0;word-break:break-all;">${verifyUrl}</p>
    <div style="background-color:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#856404;font-size:14px;line-height:1.6;margin:0;"><strong>Security Note:</strong> This verification link expires in 24 hours. If you did not create an account with ${PLATFORM_NAME}, please ignore this email.</p>
    </div>
    `
  );
}

function buildPasswordResetHtml(name: string | undefined, token: string): string {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  const greeting = name ? `Hello ${name},` : "Hello,";

  return emailTemplate(
    "Password Reset Request",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px 0;">Password Reset Request</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">We received a request to reset your password for your ${PLATFORM_NAME} account. Click the button below to create a new password.</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:8px 0 32px 0;">
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Reset My Password</a>
        </td>
      </tr>
    </table>
    <p style="color:#6c757d;font-size:14px;line-height:1.6;margin:0 0 8px 0;">Or copy and paste this link:</p>
    <p style="color:#4F46E5;font-size:13px;line-height:1.6;margin:0 0 24px 0;word-break:break-all;">${resetUrl}</p>
    <div style="background-color:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#856404;font-size:14px;line-height:1.6;margin:0;"><strong>Security Note:</strong> This link expires in 1 hour and can only be used once. If you didn't request a password reset, please ignore this email — your password will remain unchanged.</p>
    </div>
    `
  );
}

function buildOrderConfirmationHtml(
  name: string | undefined,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  shippingAddress?: string,
  estimatedDelivery?: string
): string {
  const greeting = name ? `Hello ${name},` : "Hello,";
  const itemsHtml = items
    .map(
      (item, idx) => `
    <tr style="${idx % 2 === 0 ? "background-color:#f8f9fa;" : ""}">
      <td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#495057;font-size:14px;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#495057;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e9ecef;color:#495057;font-size:14px;text-align:right;">LKR ${item.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
    </tr>`
    )
    .join("");

  let extrasHtml = "";
  if (shippingAddress) {
    extrasHtml += `
    <div style="margin:24px 0 16px 0;">
      <h3 style="color:#1a1a2e;font-size:16px;margin:0 0 8px 0;">Shipping Address</h3>
      <p style="color:#495057;font-size:14px;line-height:1.6;margin:0;">${shippingAddress}</p>
    </div>`;
  }
  if (estimatedDelivery) {
    extrasHtml += `
    <div style="margin:0 0 16px 0;">
      <h3 style="color:#1a1a2e;font-size:16px;margin:0 0 8px 0;">Estimated Delivery</h3>
      <p style="color:#495057;font-size:14px;line-height:1.6;margin:0;">${estimatedDelivery}</p>
    </div>`;
  }

  return emailTemplate(
    "Order Confirmed",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px 0;">Order Confirmed!</h2>
    <p style="color:#28a745;font-size:14px;font-weight:600;margin:0 0 24px 0;">&#10003; Payment Successful</p>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">Your order <strong style="color:#4F46E5;">${orderNumber}</strong> has been confirmed and is being processed. You'll receive shipping updates as your items make their way to you.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:8px;overflow:hidden;margin:0 0 24px 0;">
      <thead>
        <tr style="background-color:#4F46E5;">
          <th style="padding:12px 16px;color:#ffffff;font-size:13px;font-weight:600;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
          <th style="padding:12px 16px;color:#ffffff;font-size:13px;font-weight:600;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
          <th style="padding:12px 16px;color:#ffffff;font-size:13px;font-weight:600;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td align="right" style="padding:16px 0;">
          <span style="color:#1a1a2e;font-size:20px;font-weight:700;">Total: LKR ${total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
        </td>
      </tr>
    </table>

    ${extrasHtml}

    <div style="background-color:#e7f3ff;border:1px solid #b3d9ff;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#004085;font-size:14px;line-height:1.6;margin:0;">Track your order anytime at <a href="${FRONTEND_URL}/orders" style="color:#4F46E5;text-decoration:none;font-weight:600;">${FRONTEND_URL}/orders</a></p>
    </div>
    `
  );
}

function buildShippingUpdateHtml(
  name: string | undefined,
  orderNumber: string,
  trackingNumber: string,
  courierName: string | undefined,
  trackingUrl: string | undefined,
  status: string,
  estimatedDelivery: string | undefined
): string {
  const greeting = name ? `Hello ${name},` : "Hello,";
  const trackingLink = trackingUrl || `https://track.${courierName?.toLowerCase().replace(/\s+/g, "") || "courier"}.com/${trackingNumber}`;

  const statusColors: Record<string, string> = {
    shipped: "#28a745",
    in_transit: "#ffc107",
    out_for_delivery: "#17a2b8",
    delivered: "#4F46E5",
  };
  const statusColor = statusColors[status.toLowerCase()] || "#6c757d";

  return emailTemplate(
    "Shipping Update",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px 0;">Shipping Update</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">Your order <strong style="color:#4F46E5;">${orderNumber}</strong> status has been updated.</p>

    <div style="background-color:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:20px 24px;margin:0 0 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;width:140px;color:#6c757d;font-size:14px;font-weight:600;vertical-align:top;">Status:</td>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="display:inline-block;background-color:${statusColor};color:#ffffff;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${status.replace(/_/g, " ")}</span>
          </td>
        </tr>
        ${courierName ? `<tr><td style="padding:8px 0;width:140px;color:#6c757d;font-size:14px;font-weight:600;">Courier:</td><td style="padding:8px 0;color:#495057;font-size:14px;">${courierName}</td></tr>` : ""}
        <tr>
          <td style="padding:8px 0;width:140px;color:#6c757d;font-size:14px;font-weight:600;">Tracking No:</td>
          <td style="padding:8px 0;">
            <a href="${trackingLink}" style="color:#4F46E5;text-decoration:none;font-size:14px;font-weight:600;">${trackingNumber}</a>
          </td>
        </tr>
        ${estimatedDelivery ? `<tr><td style="padding:8px 0;width:140px;color:#6c757d;font-size:14px;font-weight:600;">Est. Delivery:</td><td style="padding:8px 0;color:#495057;font-size:14px;">${estimatedDelivery}</td></tr>` : ""}
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${trackingLink}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Track Your Package</a>
        </td>
      </tr>
    </table>

    <div style="margin:24px 0 0 0;padding:16px 20px;background-color:#f8f9fa;border-radius:8px;">
      <p style="color:#6c757d;font-size:13px;line-height:1.6;margin:0;">Tracking information may take up to 24 hours to appear after you receive this notification. For any questions about your delivery, please contact our support team.</p>
    </div>
    `
  );
}

function buildWelcomeHtml(name: string | undefined): string {
  const greeting = name ? `Welcome, ${name}!` : "Welcome!";

  return emailTemplate(
    "Welcome to Loopingon",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px 0;">${greeting}</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">Thank you for joining ${PLATFORM_NAME} — Sri Lanka's premier marketplace for authentic, handcrafted treasures. We're thrilled to have you as part of our community.</p>

    <div style="margin:0 0 24px 0;">
      <h3 style="color:#1a1a2e;font-size:17px;margin:0 0 12px 0;">What You Can Do on ${PLATFORM_NAME}</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;"><span style="color:#28a745;font-size:18px;">&#10003;</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;">Discover thousands of unique handcrafted items from skilled artisans across Sri Lanka</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="color:#28a745;font-size:18px;">&#10003;</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;">Support local craftspeople and Sri Lankan heritage crafts</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="color:#28a745;font-size:18px;">&#10003;</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;">Earn loyalty points on every purchase and redeem them for discounts</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="color:#28a745;font-size:18px;">&#10003;</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;">Participate in craft competitions and community events</td>
        </tr>
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td align="center" style="padding:8px 0;">
          <a href="${FRONTEND_URL}/products" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Start Exploring</a>
        </td>
      </tr>
    </table>

    <div style="background-color:#e7f3ff;border:1px solid #b3d9ff;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#004085;font-size:14px;line-height:1.6;margin:0;"><strong>Need help getting started?</strong> Visit our <a href="${FRONTEND_URL}/help" style="color:#4F46E5;text-decoration:none;font-weight:600;">Help Center</a> or reply to this email.</p>
    </div>
    `
  );
}

let emailQueue: Queue<EmailJobData> | null = null;

export function getEmailQueue(): Queue<EmailJobData> {
  if (!emailQueue) {
    emailQueue = new Queue<EmailJobData>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: { age: 86400 },
        removeOnFail: { age: 604800 },
      },
    });
  }
  return emailQueue;
}

const emailWorker = new Worker<EmailJobData>(
  QUEUE_NAME,
  async (job: Job<EmailJobData>) => {
    const { type, data } = job.data;
    logger.info(`Processing email job ${job.id} of type ${type}`);

    switch (type) {
      case "sendVerificationEmail": {
        const html = buildVerificationHtml(data.name, data.token);
        await sendEmail({
          to: data.email,
          subject: `Verify Your Email - ${PLATFORM_NAME}`,
          html,
        });
        break;
      }

      case "sendPasswordResetEmail": {
        const html = buildPasswordResetHtml(data.name, data.token);
        await sendEmail({
          to: data.email,
          subject: `Reset Your Password - ${PLATFORM_NAME}`,
          html,
        });
        break;
      }

      case "sendOrderConfirmation": {
        const html = buildOrderConfirmationHtml(
          data.name,
          data.orderNumber,
          data.items,
          data.total,
          data.shippingAddress,
          data.estimatedDelivery
        );
        await sendEmail({
          to: data.email,
          subject: `Order Confirmed - ${data.orderNumber}`,
          html,
        });
        break;
      }

      case "sendShippingUpdate": {
        const html = buildShippingUpdateHtml(
          data.name,
          data.orderNumber,
          data.trackingNumber,
          data.courierName,
          data.trackingUrl,
          data.status,
          data.estimatedDelivery
        );
        await sendEmail({
          to: data.email,
          subject: `Shipping Update for ${data.orderNumber} - ${PLATFORM_NAME}`,
          html,
        });
        break;
      }

      case "sendWelcomeEmail": {
        const html = buildWelcomeHtml(data.name);
        await sendEmail({
          to: data.email,
          subject: `Welcome to ${PLATFORM_NAME}!`,
          html,
        });
        break;
      }

      default:
        logger.warn(`Unknown email job type: ${(job.data as any).type}`);
    }

    logger.info(`Completed email job ${job.id} of type ${type}`);
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 5,
    limiter: { max: 50, duration: 1000 },
  }
);

emailWorker.on("failed", (job, err) => {
  logger.error(`Email job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

emailWorker.on("completed", (job) => {
  logger.info(`Email job ${job.id} completed`);
});

export async function addVerificationEmailJob(email: string, token: string, name?: string) {
  return getEmailQueue().add("verification", {
    type: "sendVerificationEmail",
    data: { email, token, name },
  } as VerificationEmailJob);
}

export async function addPasswordResetEmailJob(email: string, token: string, name?: string) {
  return getEmailQueue().add("password-reset", {
    type: "sendPasswordResetEmail",
    data: { email, token, name },
  } as PasswordResetEmailJob);
}

export async function addOrderConfirmationJob(
  email: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  name?: string,
  shippingAddress?: string,
  estimatedDelivery?: string
) {
  return getEmailQueue().add("order-confirmation", {
    type: "sendOrderConfirmation",
    data: { email, name, orderNumber, items, total, shippingAddress, estimatedDelivery },
  } as OrderConfirmationJob);
}

export async function addShippingUpdateJob(
  email: string,
  orderNumber: string,
  trackingNumber: string,
  status: string,
  name?: string,
  trackingUrl?: string,
  courierName?: string,
  estimatedDelivery?: string
) {
  return getEmailQueue().add("shipping-update", {
    type: "sendShippingUpdate",
    data: { email, name, orderNumber, trackingNumber, trackingUrl, courierName, status, estimatedDelivery },
  } as ShippingUpdateJob);
}

export async function addWelcomeEmailJob(email: string, name?: string) {
  return getEmailQueue().add("welcome", {
    type: "sendWelcomeEmail",
    data: { email, name },
  } as WelcomeEmailJob);
}

export { emailWorker };
