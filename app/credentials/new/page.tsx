import { redirect } from 'next/navigation'
import CredentialForm from "../credentials-form";

import {
  CreateCredentialDto,
  CredentialDto,
  createCredential,
} from "@/lib/services/credentials.service";
import { getSession } from "@/lib/auth";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function NewCredentialPage() {
  const session = await getSession();

  if (!session)
    redirect('/api/auth/signin');
  if (!secret)
    throw Error("Missing encryption secret");

  const handleSubmit = async (credential: Partial<CredentialDto>) => {
    "use server";
    if (session && session.user.id) {
      credential.userId = parseInt(session.user.id)
    } else {
      return null
    }
    const result = await createCredential(
      credential as CreateCredentialDto,
      secret,
    );
    return result;
  };

  return (
    <div className="flex max-w-full justify-center">
      <CredentialForm
        className="min-w-[90vw] md:min-w-[70vw] lg:min-w-[40vw]"
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
