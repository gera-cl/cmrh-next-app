import { getCredentialsByUserId } from "@/lib/services/credentials.service";
import CredentialsTable from "./credentials-table";
import { getSession } from "@/lib/auth";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function CredentialsPage() {
  const session = await getSession();

  if (!session || !session.user.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret)
    return Response.json(
      { error: "Missing encryption secret" },
      { status: 500 },
    );
  const data = await getCredentialsByUserId(session.user.id, secret);

  return (
    <div>
      <CredentialsTable credentials={data} />
    </div>
  );
}