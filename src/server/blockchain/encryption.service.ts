import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const KEY = crypto
  .createHash("sha256")
  .update(
    process.env.WALLET_ENCRYPTION_KEY ??
      "change-this-before-production"
  )
  .digest();

export class EncryptionService {
  encrypt(text: string) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      ALGORITHM,
      KEY,
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([
      iv,
      authTag,
      encrypted,
    ]).toString("base64");
  }

  decrypt(payload: string) {
    const buffer = Buffer.from(payload, "base64");

    const iv = buffer.subarray(0, 16);

    const authTag = buffer.subarray(16, 32);

    const encrypted = buffer.subarray(32);

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      iv
    );

    decipher.setAuthTag(authTag);

    return (
      decipher.update(encrypted).toString("utf8") +
      decipher.final("utf8")
    );
  }
}

export const encryptionService =
  new EncryptionService();