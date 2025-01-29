import { redirect } from 'next/navigation'
import CredentialsTable from "./credentials-table";

import { getCredentialsByUserId } from "@/lib/services/credentials.service";
import { getSession } from "@/lib/auth";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function CredentialsPage() {
  const session = await getSession();

  if (!session)
    redirect('/api/auth/signin');
  if (!secret)
    throw Error("Missing encryption secret");

  let data: any[] = []
  if (session && session.user.id) {
    data = await getCredentialsByUserId(session.user.id, secret)();
    data = data.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div>
      <CredentialsTable credentials={data} />
    </div>
  );
}
