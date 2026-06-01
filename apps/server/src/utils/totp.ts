import crypto from "crypto";

export function generateTOTPSecret(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    codes.push(crypto.randomBytes(4).toString("hex").toUpperCase());
  }
  return codes;
}

export function verifyTOTP(secret: string, token: string): boolean {
  const timeWindow = 30;
  const currentTime = Math.floor(Date.now() / 1000);
  const counter = Math.floor(currentTime / timeWindow);

  for (let i = -1; i <= 1; i++) {
    const expectedToken = generateTOTPValue(secret, counter + i);
    if (expectedToken === token) {
      return true;
    }
  }
  return false;
}

function generateTOTPValue(secret: string, counter: number): string {
  const hmac = crypto.createHmac("sha1", Buffer.from(secret, "base64url"));
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter), 0);
  const hash = hmac.update(counterBuffer).digest();
  const offset = hash[hash.length - 1] & 0xf;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}
