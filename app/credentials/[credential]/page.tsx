import { redirect } from "next/navigation";
import CredentialForm from "../credentials-form";

import {
  CredentialDto,
  getCredentialById,
  updateCredential,
  deleteCredential,
} from "@/lib/services/credentials.service";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function CredentialDetails({
  params,
}: {
  params: Promise<{ credential: string }>;
}) {
  if (!secret)
    throw Error("Missing encryption secret");

  const credentialId = (await params).credential;
  const credential = await getCredentialById(credentialId, secret);

  const handleSubmit = async (credential: Partial<CredentialDto>) => {
    "use server";
    const result = await updateCredential(credentialId, credential, secret);
    return result ? true : false;
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
