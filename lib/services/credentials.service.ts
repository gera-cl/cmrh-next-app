import * as credentialsQueries from "@/lib/db/queries/credentials.queries";
import { encrypt, decrypt } from "../util/cipher.util";
import { revalidateTag, unstable_cache } from 'next/cache'

async function internal_getCredentialsByUserId(userId: string, cipherSecret: string): Promise<CredentialDto[]> {
  let credentials = await credentialsQueries.getCredentialsByUserId(parseInt(userId));

  credentials = await Promise.all(
    credentials.map((credential) =>
      Promise.all([
        decrypt(cipherSecret, {
          encryptedText: credential.password,
          iv: credential.password_iv,
          authTag: credential.password_authTag,
        }),
        credential.note && credential.note_iv && credential.note_authTag
          ? decrypt(cipherSecret, {
            encryptedText: credential.note,
            iv: credential.note_iv,
            authTag: credential.note_authTag,
          })
          : null,
      ]).then(([password, note]) => ({
        ...credential,
        password,
        note,
      })),
    ),
  );

  const credentials_dto = credentials.map((credential) => ({
    ...credential,
    password_iv: undefined,
    password_authTag: undefined,
    note_iv: undefined,
    note_authTag: undefined,
  }));

  return credentials_dto;
}

export function getCredentialsByUserId(userId: string, cipherSecret: string) {
  return unstable_cache(
    () => internal_getCredentialsByUserId(userId, cipherSecret),
    [`credentials-${userId}`],
    { revalidate: 3600, tags: [`credentials-${userId}`] }
  );
}

export async function createCredential(credential: any, cipherSecret: string) {
  // Encrypt password
  const password_encryptedData = await encrypt(credential.password, cipherSecret);

  credential.password = password_encryptedData.encryptedText;
  credential.password_iv = password_encryptedData.iv;
  credential.password_authTag = password_encryptedData.authTag;

  // Encrypt note, if it exists
  if (credential.note && credential.note.trim().length > 0) {
    const note_encryptedData = await encrypt(credential.note, cipherSecret);
    credential.note = note_encryptedData.encryptedText;
    credential.note_iv = note_encryptedData.iv;
    credential.note_authTag = note_encryptedData.authTag;
  }

  try {
    const result = await credentialsQueries.createCredential(credential);
    revalidateTag(`credentials-${credential.userId}`)
    return { id: result[0].id };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type CredentialDto = {
  id: number
  url: string
  name: string
  username: string
  alternative_username: string | null
  password: string
  note: string | null
  userId: number
  createdAt: Date
  updatedAt: Date
}
