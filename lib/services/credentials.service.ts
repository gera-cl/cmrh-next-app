import { revalidateTag, unstable_cache } from "next/cache";

import { encrypt, decrypt } from "../util/cipher.util";

import * as credentialsQueries from "@/lib/db/queries/credentials.queries";

async function internal_getCredentialsByUserId(
  userId: string,
  cipherSecret: string,
): Promise<CredentialDto[]> {
  let credentials = await credentialsQueries.getCredentialsByUserId(
    parseInt(userId),
  );

  const credentials_dto: CredentialDto[] = await Promise.all(
    credentials.map((credential) => getCredentialDto(credential, cipherSecret)),
  );

  return credentials_dto;
}

export function getCredentialsByUserId(userId: string, cipherSecret: string) {
  return unstable_cache(
    () => internal_getCredentialsByUserId(userId, cipherSecret),
    [`credentials-${userId}`],
    { revalidate: 3600, tags: [`credentials-${userId}`] },
  );
}

export async function createCredential(
  credential: CreateCredentialDto,
  cipherSecret: string,
) {
  // Encrypt password
  const password_encryptedData = await encrypt(
    credential.password,
    cipherSecret,
  );
  const newCredential: Omit<
    CredentialFullDto,
    "id" | "createdAt" | "updatedAt"
  > = {
    ...credential,
    password: password_encryptedData.encryptedText,
    password_iv: password_encryptedData.iv,
    password_authTag: password_encryptedData.authTag,
  };

  // Encrypt note, if it exists
  if (credential.note && credential.note.trim().length > 0) {
    const note_encryptedData = await encrypt(credential.note, cipherSecret);

    newCredential.note = note_encryptedData.encryptedText;
    newCredential.note_iv = note_encryptedData.iv;
    newCredential.note_authTag = note_encryptedData.authTag;
  }

  try {
    const result = await credentialsQueries.createCredential(newCredential);
    revalidateTag(`credentials-${credential.userId}`);
    return { id: result[0].id };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCredentialById(id: string, cipherSecret: string) {
  const credential: CredentialFullDto[] =
    await credentialsQueries.getCredentialById(parseInt(id));

  if (credential.length === 0) return undefined;

  return getCredentialDto(credential[0], cipherSecret);
}

export async function updateCredential(
  id: string,
  credential: Partial<CredentialFullDto>,
  cipherSecret: string,
) {
  if (credential.password) {
    // Encrypt password
    const password_encryptedData = await encrypt(
      credential.password,
      cipherSecret,
    );

    credential.password = password_encryptedData.encryptedText;
    credential.password_iv = password_encryptedData.iv;
    credential.password_authTag = password_encryptedData.authTag;
  }

  // Encrypt note, if it exists
  if (credential.note && credential.note.trim().length > 0) {
    const note_encryptedData = await encrypt(credential.note, cipherSecret);

    credential.note = note_encryptedData.encryptedText;
    credential.note_iv = note_encryptedData.iv;
    credential.note_authTag = note_encryptedData.authTag;
  } else {
    credential.note = null;
    credential.note_iv = null;
    credential.note_authTag = null;
  }

  try {
    const result = await credentialsQueries.updateCredential(
      parseInt(id),
      credential,
    );
    revalidateTag(`credentials-${credential.userId}`);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteCredential(id: string) {
  try {
    const result = await credentialsQueries.deleteCredential(parseInt(id));
    // ! the revalidation closes the delete confirmation modal
    revalidateTag(`credentials-${result[0].userId}`);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Util methods

async function getCredentialDto(
  credential: CredentialFullDto,
  cipherSecret: string,
): Promise<CredentialDto> {
  return Promise.all([
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
      : undefined,
  ]).then(([password, note]) => ({
    ...credential,
    alternative_username: credential.alternative_username || undefined,
    password,
    note,
    password_iv: undefined,
    password_authTag: undefined,
    note_iv: undefined,
    note_authTag: undefined,
  }));
}

// Types

export type CredentialDto = {
  id: number;
  url: string;
  name: string;
  username: string;
  alternative_username?: string | null;
  password: string;
  note?: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCredentialDto = Omit<
  CredentialDto,
  "id" | "createdAt" | "updatedAt"
>;

type CredentialFullDto = CredentialDto & {
  password_iv: string;
  password_authTag: string;
  note_iv?: string | null;
  note_authTag?: string | null;
};
