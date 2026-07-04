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
    items: Array<{ name: string; quantity: number; price: number; image?: string | null }>;
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

interface SellerWelcomeEmailJob {
  type: "sendSellerWelcomeEmail";
  data: { email: string; name?: string; storeName?: string };
}

interface CartUpdateJob {
  type: "sendCartUpdate";
  data: {
    email: string;
    name?: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    cartItemCount: number;
    cartTotal: number;
  };
}

interface AbandonedCartReminderJob {
  type: "sendAbandonedCartReminder";
  data: {
    email: string;
    name?: string;
    cartItemCount: number;
    cartTotal: number;
    firstItemName: string;
    firstItemImage?: string;
    hoursAbandoned: number;
  };
}

interface PromotionalEmailJob {
  type: "sendPromotionalEmail";
  data: {
    email: string;
    subject: string;
    title: string;
    subtitle?: string;
    heroImage?: string;
    heroCtaText?: string;
    heroCtaLink?: string;
    curatedProducts?: Array<{ name: string; price: number; image: string; link: string }>;
    featuredProducts?: Array<{ name: string; price: number; image: string; link: string }>;
  };
}

type EmailJobData =
  | VerificationEmailJob
  | PasswordResetEmailJob
  | OrderConfirmationJob
  | ShippingUpdateJob
  | WelcomeEmailJob
  | SellerWelcomeEmailJob
  | CartUpdateJob
  | AbandonedCartReminderJob
  | PromotionalEmailJob;

const FRONTEND_URL = process.env.FRONTEND_URL || "https://kandyam.com";
const PLATFORM_NAME = process.env.PLATFORM_NAME || "Kandyam";
const EMAIL_FROM = process.env.SMTP_FROM || process.env.EMAIL_FROM || "Kandyam <no-reply@kandyam.com>";

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
            <td style="background:linear-gradient(135deg,#FA6873,#F7444E);padding:32px 40px;text-align:center;">
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
                    <p style="margin:0 0 16px 0;">
                      <a href="${FRONTEND_URL}/legal/privacy" style="color:#F7444E;text-decoration:none;">Privacy Policy</a> &nbsp;|&nbsp; 
                      <a href="${FRONTEND_URL}/legal/terms" style="color:#F7444E;text-decoration:none;">Terms of Use</a> &nbsp;|&nbsp; 
                      <a href="${FRONTEND_URL}/dashboard/settings" style="color:#F7444E;text-decoration:none;">Email Preferences</a> &nbsp;|&nbsp; 
                      <a href="${FRONTEND_URL}/unsubscribe" style="color:#F7444E;text-decoration:none;">Unsubscribe</a>
                    </p>
                    <p style="margin:0 0 8px 0;">If you cannot unsubscribe from the mailing list or have concerns about your personal data, please email <a href="mailto:support@kandyam.com" style="color:#F7444E;text-decoration:none;">support@kandyam.com</a></p>
                    <p style="margin:0 0 16px 0;">Kandyam E-commerce Private Limited, 42 Galle Road, Colombo 03, Sri Lanka</p>
                    <p style="margin:0;color:#adb5bd;">&copy; ${new Date().getFullYear()} ${PLATFORM_NAME}. All rights reserved.</p>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="${FRONTEND_URL}" style="display:inline-block;margin-left:12px;text-decoration:none;">
                      <img src="${FRONTEND_URL}/icon.svg" alt="${PLATFORM_NAME}" width="40" height="40" style="border-radius:8px;" />
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
          <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#FA6873,#F7444E);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Verify Email Address</a>
        </td>
      </tr>
    </table>
    <p style="color:#6c757d;font-size:14px;line-height:1.6;margin:0 0 8px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="color:#F7444E;font-size:13px;line-height:1.6;margin:0 0 24px 0;word-break:break-all;">${verifyUrl}</p>
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
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#FA6873,#F7444E);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Reset My Password</a>
        </td>
      </tr>
    </table>
    <p style="color:#6c757d;font-size:14px;line-height:1.6;margin:0 0 8px 0;">Or copy and paste this link:</p>
    <p style="color:#F7444E;font-size:13px;line-height:1.6;margin:0 0 24px 0;word-break:break-all;">${resetUrl}</p>
    <div style="background-color:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#856404;font-size:14px;line-height:1.6;margin:0;"><strong>Security Note:</strong> This link expires in 1 hour and can only be used once. If you didn't request a password reset, please ignore this email — your password will remain unchanged.</p>
    </div>
    `
  );
}

function buildOrderConfirmationHtml(
  name: string | undefined,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number; image?: string | null }>,
  total: number,
  shippingAddress?: string,
  estimatedDelivery?: string
): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;">
        <table cellpadding="0" cellspacing="0"><tr>
          ${item.image ? `<td style="width:56px;padding-right:12px;vertical-align:top;"><img src="${item.image}" alt="${item.name}" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" /></td>` : ""}
          <td style="vertical-align:top;"><span style="color:#1a1a2e;font-size:14px;font-weight:600;">${item.name}</span><br/><span style="color:#9CA3AF;font-size:12px;">Qty: ${item.quantity}</span></td>
        </tr></table>
      </td>
      <td style="padding:14px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#1a1a2e;font-size:14px;font-weight:600;white-space:nowrap;">Rs. ${(item.price * item.quantity).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
    </tr>`
    )
    .join("");

  const shippingCost = total - subtotal;

  return emailTemplate(
    "Order Confirmed — Kandyam",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 6px 0;">Your Order is Confirmed! 🎉</h2>
    <p style="color:#495057;font-size:15px;line-height:1.7;margin:0 0 20px 0;">${greeting}</p>
    <p style="color:#495057;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Thank you for your order! We've received your order <strong style="color:#1a1a2e;">#${orderNumber}</strong> and it's now being prepared for delivery.</p>

    <div style="background-color:#FFF7ED;border-left:4px solid #F97316;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 24px 0;">
      <p style="color:#92400E;font-size:14px;line-height:1.5;margin:0;"><strong>💰 Cash on Delivery:</strong> No payment is needed right now. Pay <strong>Rs. ${total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</strong> when your order arrives.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin:0 0 20px 0;">
      <thead>
        <tr style="background-color:#f8f9fa;">
          <th style="padding:12px 16px;color:#6B7280;font-size:12px;font-weight:600;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
          <th style="padding:12px 16px;color:#6B7280;font-size:12px;font-weight:600;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td style="padding:6px 16px;color:#6B7280;font-size:13px;">Subtotal</td>
        <td style="padding:6px 16px;color:#1a1a2e;font-size:13px;text-align:right;">Rs. ${subtotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
      </tr>
      ${shippingCost > 0 ? `<tr>
        <td style="padding:6px 16px;color:#6B7280;font-size:13px;">Shipping (Koombiyo)</td>
        <td style="padding:6px 16px;color:#1a1a2e;font-size:13px;text-align:right;">Rs. ${shippingCost.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 16px;border-top:2px solid #1a1a2e;color:#1a1a2e;font-size:16px;font-weight:700;">Total (COD)</td>
        <td style="padding:10px 16px;border-top:2px solid #1a1a2e;color:#1a1a2e;font-size:16px;font-weight:700;text-align:right;">Rs. ${total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
      </tr>
    </table>

    ${shippingAddress ? `
    <div style="background-color:#f8f9fa;border-radius:10px;padding:16px 20px;margin:0 0 16px 0;">
      <p style="color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px 0;">📦 Delivering To</p>
      <p style="color:#1a1a2e;font-size:14px;line-height:1.6;margin:0;">${shippingAddress}</p>
    </div>` : ""}

    ${estimatedDelivery ? `
    <div style="background-color:#f8f9fa;border-radius:10px;padding:16px 20px;margin:0 0 20px 0;">
      <p style="color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px 0;">🚚 Estimated Delivery</p>
      <p style="color:#1a1a2e;font-size:14px;line-height:1.6;margin:0;">${estimatedDelivery}</p>
    </div>` : ""}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
      <tr>
        <td align="center">
          <a href="${FRONTEND_URL}/track-order" style="display:inline-block;background-color:#1a1a2e;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:600;">Track Your Order</a>
        </td>
      </tr>
    </table>
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
    "Welcome to Kandyam",
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

function buildSellerWelcomeHtml(name: string | undefined, storeName: string | undefined): string {
  const greeting = name ? `Welcome, ${name}!` : "Welcome to Kandyam!";
  
  return emailTemplate(
    "Welcome to the Kandyam Artisan Community",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px 0;">${greeting}</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">We are absolutely thrilled to welcome you and ${storeName ? `<strong>${storeName}</strong>` : "your store"} to the Kandyam marketplace. Your craftsmanship is exactly what our global community is looking for.</p>

    <div style="background:linear-gradient(135deg,#F7F8F3,#FFFFFF);border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin:0 0 24px 0;">
      <h3 style="color:#1a1a2e;font-size:17px;margin:0 0 12px 0;">Your Next Steps as an Artisan</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;"><span style="color:#4F46E5;font-size:18px;">1.</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;"><strong>Complete your store profile:</strong> Add a banner, profile picture, and your unique story.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="color:#4F46E5;font-size:18px;">2.</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;"><strong>Add your first products:</strong> Upload high-quality photos and detailed descriptions of your crafts.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="color:#4F46E5;font-size:18px;">3.</span></td>
          <td style="padding:8px 0;color:#495057;font-size:14px;line-height:1.6;"><strong>Setup payouts:</strong> Connect your bank account so you can get paid bi-weekly.</td>
        </tr>
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      <tr>
        <td align="center" style="padding:8px 0;">
          <a href="${FRONTEND_URL}/seller/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">Go to Seller Dashboard</a>
        </td>
      </tr>
    </table>

    <div style="background-color:#e7f3ff;border:1px solid #b3d9ff;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#004085;font-size:14px;line-height:1.6;margin:0;"><strong>Need help setting up?</strong> Contact our artisan support team at <a href="mailto:artisans@kandyam.com" style="color:#4F46E5;text-decoration:none;font-weight:600;">artisans@kandyam.com</a>.</p>
    </div>
    `
  );
}

function buildCartUpdateHtml(
  name: string | undefined,
  productName: string,
  productImage: string | undefined,
  quantity: number,
  price: number,
  cartItemCount: number,
  cartTotal: number
): string {
  const greeting = name ? `Hello ${name},` : "Hello,";

  return emailTemplate(
    "Item Added to Cart",
    `
    <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px 0;">Item Added to Your Cart</h2>
    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>

    <div style="background-color:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:20px 24px;margin:0 0 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${productImage ? `<tr><td colspan="2" style="padding:0 0 16px 0;"><img src="${productImage}" alt="${productName}" style="border-radius:8px;max-width:200px;height:auto;" /></td></tr>` : ""}
        <tr>
          <td style="padding:6px 0;width:80px;color:#6c757d;font-size:14px;font-weight:600;">Product:</td>
          <td style="padding:6px 0;color:#495057;font-size:14px;font-weight:600;">${productName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6c757d;font-size:14px;font-weight:600;">Quantity:</td>
          <td style="padding:6px 0;color:#495057;font-size:14px;">${quantity}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6c757d;font-size:14px;font-weight:600;">Price:</td>
          <td style="padding:6px 0;color:#495057;font-size:14px;">LKR ${price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>
    </div>

    <p style="color:#495057;font-size:16px;line-height:1.7;margin:0 0 8px 0;">You now have <strong>${cartItemCount} item${cartItemCount !== 1 ? "s" : ""}</strong> in your cart with a total of <strong>LKR ${cartTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</strong>.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${FRONTEND_URL}/cart" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">View Your Cart</a>
        </td>
      </tr>
    </table>

    <div style="background-color:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px 20px;margin:0 0 8px 0;">
      <p style="color:#856404;font-size:14px;line-height:1.6;margin:0;">Items in your cart are not reserved. Complete your purchase soon to avoid missing out!</p>
    </div>
    `
  );
}

function buildAbandonedCartReminderHtml(
  name: string | undefined,
  cartItemCount: number,
  cartTotal: number,
  firstItemName: string,
  firstItemImage: string | undefined,
  hoursAbandoned: number
): string {
  const greeting = name ? `Hello ${name},` : "Hello,";
  
  let timeText = "recently";
  if (hoursAbandoned === 1) timeText = "1 hour ago";
  else if (hoursAbandoned < 24) timeText = `${hoursAbandoned} hours ago`;
  else if (hoursAbandoned === 24) timeText = "1 day ago";
  else if (hoursAbandoned < 168) timeText = `${Math.floor(hoursAbandoned / 24)} days ago`;
  else if (hoursAbandoned === 168) timeText = "a week ago";

  return emailTemplate(
    "Your cart is waiting...",
    `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">🛒</span>
    </div>
    <h2 style="color:#002C3E;font-size:24px;margin:0 0 12px 0;font-family:Georgia,serif;">You left something behind</h2>
    <p style="color:#6B7280;font-size:16px;line-height:1.7;margin:0 0 8px 0;">${greeting}</p>

    <p style="color:#1F2937;font-size:16px;line-height:1.7;margin:0 0 24px 0;">You added <strong>${cartItemCount} item${cartItemCount !== 1 ? "s" : ""}</strong> to your cart <strong>${timeText}</strong>. They're still available — but don't wait too long!</p>

    <div style="background:linear-gradient(135deg,#F7F8F3,#FFFFFF);border:1px solid #E5E7EB;border-radius:16px;padding:24px;margin:0 0 28px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${firstItemImage ? `<tr><td colspan="2" style="padding:0 0 18px 0;text-align:center;"><img src="${firstItemImage}" alt="${firstItemName}" style="border-radius:12px;max-width:200px;height:auto;box-shadow:0 4px 20px rgba(0,0,0,0.08);" /></td></tr>` : ""}
        <tr>
          <td style="padding:8px 0;width:90px;color:#9CA3AF;font-size:13px;font-weight:600;">Item</td>
          <td style="padding:8px 0;color:#1F2937;font-size:15px;font-weight:600;">${firstItemName} ${cartItemCount > 1 ? `+ ${cartItemCount - 1} more` : ""}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#9CA3AF;font-size:13px;font-weight:600;">Total</td>
          <td style="padding:8px 0;color:#F7444E;font-size:18px;font-weight:700;">Rs. ${cartTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#9CA3AF;font-size:12px;">Delivery</td>
          <td style="padding:6px 0;color:#10B981;font-size:13px;font-weight:500;">Cash on Delivery</td>
        </tr>
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td align="center">
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:16px 0 0 0;">No payment needed — pay cash when your order arrives via Koombiyo.</p>
    </div>
    `
  );
}

function buildPromotionalHtml(
  title: string,
  subtitle?: string,
  heroImage?: string,
  heroCtaText?: string,
  heroCtaLink?: string,
  curatedProducts?: Array<{ name: string; price: number; image: string; link: string }>,
  featuredProducts?: Array<{ name: string; price: number; image: string; link: string }>
): string {
  let innerHtml = `
    <h2 style="color:#1a1a2e;font-size:24px;font-weight:700;margin:0 0 12px 0;text-align:center;">${title}</h2>
  `;

  if (subtitle) {
    innerHtml += `<p style="color:#495057;font-size:16px;line-height:1.6;margin:0 0 24px 0;text-align:center;">${subtitle}</p>`;
  }

  if (heroImage) {
    innerHtml += `<div style="text-align:center;margin:0 0 24px 0;"><img src="${heroImage}" alt="${title}" style="max-width:100%;border-radius:12px;height:auto;" /></div>`;
  }

  if (heroCtaText && heroCtaLink) {
    innerHtml += `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
        <tr>
          <td align="center">
            <a href="${heroCtaLink}" style="display:inline-block;background-color:#E63946;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;">${heroCtaText}</a>
          </td>
        </tr>
      </table>
    `;
  }

  const renderProductGrid = (products: Array<{ name: string; price: number; image: string; link: string }>) => {
    let gridHtml = `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;"><tr>`;
    products.forEach((product, idx) => {
      if (idx > 0 && idx % 3 === 0) {
        gridHtml += `</tr><tr><td colspan="3" height="16"></td></tr><tr>`;
      }
      gridHtml += `
        <td width="31%" valign="top" align="center" style="background:#f8f9fa;border-radius:8px;padding:12px;border:1px solid #e9ecef;">
          <a href="${product.link}" style="text-decoration:none;color:inherit;display:block;">
            <img src="${product.image}" alt="${product.name}" style="width:100%;max-width:140px;height:auto;border-radius:6px;margin:0 0 12px 0;aspect-ratio:1/1;object-fit:cover;" />
            <h4 style="color:#1a1a2e;font-size:13px;font-weight:600;margin:0 0 6px 0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${product.name}</h4>
            <p style="color:#E63946;font-size:14px;font-weight:700;margin:0;text-align:left;">LKR ${product.price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</p>
          </a>
        </td>
      `;
      if (idx % 3 !== 2 && idx !== products.length - 1) {
        gridHtml += `<td width="3%"></td>`; // spacer
      }
    });
    // Pad remaining cells if row is not full
    const remainder = products.length % 3;
    if (remainder === 1) {
      gridHtml += `<td width="3%"></td><td width="31%"></td><td width="3%"></td><td width="31%"></td>`;
    } else if (remainder === 2) {
      gridHtml += `<td width="3%"></td><td width="31%"></td>`;
    }
    gridHtml += `</tr></table>`;
    return gridHtml;
  };

  if (curatedProducts && curatedProducts.length > 0) {
    innerHtml += `<h3 style="color:#1a1a2e;font-size:18px;margin:0 0 16px 0;">Curated for you</h3>`;
    innerHtml += renderProductGrid(curatedProducts);
  }

  if (featuredProducts && featuredProducts.length > 0) {
    innerHtml += `<h3 style="color:#1a1a2e;font-size:18px;margin:0 0 16px 0;">Featured products</h3>`;
    innerHtml += renderProductGrid(featuredProducts);
  }

  innerHtml += `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
      <tr>
        <td align="center">
          <a href="${FRONTEND_URL}/products" style="display:inline-block;background-color:#E63946;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:24px;font-size:15px;font-weight:600;">View more</a>
        </td>
      </tr>
    </table>
    <p style="color:#868e96;font-size:12px;line-height:1.5;margin:24px 0 0 0;text-align:center;">Pricing, discounts, and stock levels are accurate at the time of sending but may change. Check the product details page for updates.</p>
  `;

  return emailTemplate(title, innerHtml);
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

      case "sendSellerWelcomeEmail": {
        const html = buildSellerWelcomeHtml(data.name, (data as any).storeName);
        await sendEmail({
          to: data.email,
          subject: `Welcome to the ${PLATFORM_NAME} Artisan Community!`,
          html,
        });
        break;
      }

      case "sendCartUpdate": {
        const html = buildCartUpdateHtml(
          data.name,
          data.productName,
          data.productImage,
          data.quantity,
          data.price,
          data.cartItemCount,
          data.cartTotal
        );
        await sendEmail({
          to: data.email,
          subject: `${data.productName} added to your cart - ${PLATFORM_NAME}`,
          html,
        });
        break;
      }

      case "sendAbandonedCartReminder": {
        const html = buildAbandonedCartReminderHtml(
          data.name,
          data.cartItemCount,
          data.cartTotal,
          data.firstItemName,
          data.firstItemImage,
          data.hoursAbandoned
        );
        let subject = "Did you forget something?";
        if (data.hoursAbandoned >= 24) subject = "Your cart is missing you!";
        if (data.hoursAbandoned >= 168) subject = "Final reminder: Your cart items may sell out soon";
        
        await sendEmail({
          to: data.email,
          subject: `${subject} - ${PLATFORM_NAME}`,
          html,
        });
        break;
      }

      case "sendPromotionalEmail": {
        const html = buildPromotionalHtml(
          data.title,
          data.subtitle,
          data.heroImage,
          data.heroCtaText,
          data.heroCtaLink,
          data.curatedProducts,
          data.featuredProducts
        );
        await sendEmail({
          to: data.email,
          subject: data.subject,
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

export async function addSellerWelcomeEmailJob(email: string, name?: string, storeName?: string) {
  return getEmailQueue().add("seller-welcome", {
    type: "sendSellerWelcomeEmail",
    data: { email, name, storeName },
  } as SellerWelcomeEmailJob);
}

export async function addCartUpdateJob(
  email: string,
  productName: string,
  quantity: number,
  price: number,
  cartItemCount: number,
  cartTotal: number,
  name?: string,
  productImage?: string
) {
  return getEmailQueue().add("cart-update", {
    type: "sendCartUpdate",
    data: { email, name, productName, productImage, quantity, price, cartItemCount, cartTotal },
  } as CartUpdateJob);
}

export async function addAbandonedCartReminderJob(
  email: string,
  cartItemCount: number,
  cartTotal: number,
  firstItemName: string,
  hoursAbandoned: number,
  name?: string,
  firstItemImage?: string
) {
  return getEmailQueue().add("abandoned-cart-reminder", {
    type: "sendAbandonedCartReminder",
    data: { email, name, cartItemCount, cartTotal, firstItemName, firstItemImage, hoursAbandoned },
  } as AbandonedCartReminderJob);
}

export async function addPromotionalEmailJob(
  email: string,
  subject: string,
  title: string,
  subtitle?: string,
  heroImage?: string,
  heroCtaText?: string,
  heroCtaLink?: string,
  curatedProducts?: Array<{ name: string; price: number; image: string; link: string }>,
  featuredProducts?: Array<{ name: string; price: number; image: string; link: string }>
) {
  return getEmailQueue().add("promotional-email", {
    type: "sendPromotionalEmail",
    data: { email, subject, title, subtitle, heroImage, heroCtaText, heroCtaLink, curatedProducts, featuredProducts },
  } as PromotionalEmailJob);
}

export { emailWorker };
