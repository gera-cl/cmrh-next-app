import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

let keyCache: Map<string, Buffer> = new Map();

export type EncryptedData = {
  encryptedText: string;
  iv: string;
  authTag: string;
};

export async function encrypt(
  textToEncrypt: string,
  secret: string,
): Promise<EncryptedData> {
  const iv: string = randomBytes(12).toString("hex"); // Usamos 12 bytes para GCM
  let key = keyCache.get(secret);

  if (!key) {
    // Generación de la clave con scrypt
    key = (await promisify(scrypt)(secret, "salt", 32)) as Buffer;
    keyCache.set(secret, key);
  }

  // Convertimos la clave de Buffer a Uint8Array
  const keyUint8Array = new Uint8Array(key);

  // Convertimos el IV de Buffer a Uint8Array para pasarlo como BinaryLike
  const ivUint8Array = new Uint8Array(Buffer.from(iv, "hex"));

  // Usamos 'aes-256-gcm', que es el algoritmo GCM para AES-256
  const cipher = createCipheriv(
    "aes-256-gcm",
    keyUint8Array as any,
    ivUint8Array as any,
  ); // Conversión explícita a any
  let encryptedText: string = cipher.update(textToEncrypt, "utf-8", "hex");

  encryptedText += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex"); // GCM requiere un tag de autenticación

  return { encryptedText, iv, authTag }; // Devolvemos también el tag de autenticación
}

export async function decrypt(
  secret: string,
  encryptedData: EncryptedData,
): Promise<string> {
  let key = keyCache.get(secret);

  if (!key) {
    // Generación de la clave con scrypt
    key = (await promisify(scrypt)(secret, "salt", 32)) as Buffer;
    keyCache.set(secret, key);
  }

  // Convertimos la clave de Buffer a Uint8Array
  const keyUint8Array = new Uint8Array(key);

  // Convertimos el IV de Buffer a Uint8Array para pasarlo como BinaryLike
  const ivUint8Array = new Uint8Array(Buffer.from(encryptedData.iv, "hex"));

  // Usamos 'aes-256-gcm', que es el algoritmo GCM para AES-256
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyUint8Array as any,
    ivUint8Array as any,
  ); // Conversión explícita a any

  decipher.setAuthTag(
    new Uint8Array(Buffer.from(encryptedData.authTag, "hex")),
  );

  let decryptedText: string = decipher.update(
    encryptedData.encryptedText,
    "hex",
    "utf-8",
  );

  decryptedText += decipher.final("utf-8");

  return decryptedText;
}

function generateRandomBase64() {
  return randomBytes(32).toString("base64");
}
