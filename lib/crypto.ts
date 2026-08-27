import crypto from "crypto"

type EncryptedPayload = {
  cipherText: string
  iv: string
  tag: string
}

function getKey(): Buffer {
  const key = process.env.LEADERBOARD_TOKEN_SECRET
  if (!key) {
    throw new Error("LEADERBOARD_TOKEN_SECRET is not configured.")
  }

  const buffer = Buffer.from(key, "base64")
  if (buffer.length !== 32) {
    throw new Error("LEADERBOARD_TOKEN_SECRET must be 32 bytes (base64-encoded).")
  }

  return buffer
}

export function encryptSecret(value: string): EncryptedPayload {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    cipherText: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  }
}

export function decryptSecret(payload: EncryptedPayload): string {
  const key = getKey()
  const iv = Buffer.from(payload.iv, "base64")
  const tag = Buffer.from(payload.tag, "base64")
  const encrypted = Buffer.from(payload.cipherText, "base64")

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}
