import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth";
import { createCredential, getCredentialsByUserId } from "@/lib/services/credentials.service";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret)
    return Response.json(
      { error: "Missing encryption secret" },
      { status: 500 },
    );

  let payload = await request.json();

  // Set data
  payload.userId = session.user.id;
  payload.alternative_username =
    payload.alternative_username.trim().length > 0
      ? payload.alternative_username
      : null;
  payload.note = payload.note.trim().length > 0 ? payload.note : null;

  // call service
  const createdCredential = await createCredential(payload, secret);
  if (createdCredential) {
    return Response.json(createdCredential, { status: 201 });
  } else {
    return Response.json(
      { error: "Failed to create credential" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getSession();

  if (!session || !session.user.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret)
    return Response.json(
      { error: "Missing encryption secret" },
      { status: 500 },
    );

  let credentials = await (getCredentialsByUserId(session.user.id, secret))();
  return Response.json(credentials);
}
