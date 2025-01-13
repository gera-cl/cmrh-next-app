import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { createCredential, getCredentialsByUserId } from "@/lib/db/queries/credentials.queries";
import { encrypt, decrypt } from "@/lib/util/cipher.util";

const secret = process.env.CMRH_ENCRYPTION_SECRET

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret) return Response.json({ error: "Missing encryption secret" }, { status: 500 });

  let payload = await request.json();

  // Set data
  payload.userId = session.user.id;
  payload.alternative_username = payload.alternative_username.trim().length > 0 ? payload.alternative_username : null;
  payload.note = payload.note.trim().length > 0 ? payload.note : null;

  // Encrypt password
  const password_encryptedData = await encrypt(payload.password, secret);

  payload.password = password_encryptedData.encryptedText;
  payload.password_iv = password_encryptedData.iv;
  payload.password_authTag = password_encryptedData.authTag;

  // Encrypt note, if it exists
  if (payload.note && payload.note.trim().length > 0) {
    const note_encryptedData = await encrypt(payload.note, secret);
    payload.note = note_encryptedData.encryptedText;
    payload.note_iv = note_encryptedData.iv;
    payload.note_authTag = note_encryptedData.authTag;
  }

  try {
    const result = await createCredential(payload);
    return Response.json({ id: result[0].id });
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to create credential" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || !session.user.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret) return Response.json({ error: "Missing encryption secret" }, { status: 500 });

  let credentials = await getCredentialsByUserId(parseInt(session.user.id));

  credentials = await Promise.all(
    credentials.map((credential) => Promise.all([
      decrypt(secret, {
        encryptedText: credential.password,
        iv: credential.password_iv,
        authTag: credential.password_authTag
      }),
      credential.note && credential.note_iv && credential.note_authTag ? decrypt(secret, {
        encryptedText: credential.note,
        iv: credential.note_iv,
        authTag: credential.note_authTag
      }) : null,
    ]).then(([password, note]) => ({
      ...credential,
      password,
      note,
    }))),
  );

  const credentials_dto = credentials.map((credential) => ({
    ...credential,
    password_iv: undefined,
    password_authTag: undefined,
    note_iv: undefined,
    note_authTag: undefined
  }));

  return Response.json(credentials_dto)
}