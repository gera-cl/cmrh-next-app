import { redirect } from "next/navigation";
import CredentialForm from "../credentials-form";

import {
  CredentialDto,
  updateCredential,
  deleteCredential,
  getCredentialById_cached,
} from "@/lib/services/credentials.service";
import { getSession } from "@/lib/auth";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function CredentialDetails({
  params,
}: {
  params: Promise<{ credential: string }>;
}) {
  const session = await getSession();

  if (!session)
    redirect('/api/auth/signin');
  if (!secret)
    throw Error("Missing encryption secret");

  const credentialId = (await params).credential;
  const credential = await getCredentialById_cached(credentialId, session.user.id!, secret);

  const handleSubmit = async (credential: Partial<CredentialDto>) => {
    "use server";
    const result = await updateCredential(credentialId, credential, secret);
    return result;
  };

  const handleDelete = async (id: string) => {
    "use server";
    const result = await deleteCredential(id);
    return result && result.length > 0 ? true : false;
  };

  return (
    <div className="flex max-w-full justify-center">
      <CredentialForm
        className="min-w-[90vw] md:min-w-[70vw] lg:min-w-[40vw]"
        credential={credential}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
