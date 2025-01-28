import CredentialForm from "../credentials-form";

import {
  CredentialDto,
  getCredentialById,
  updateCredential,
} from "@/lib/services/credentials.service";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function CredentialDetails({
  params,
}: {
  params: Promise<{ credential: string }>;
}) {
  if (!secret)
    return Response.json(
      { error: "Missing encryption secret" },
      { status: 500 },
    );

  const credentialId = (await params).credential;
  const credential = await getCredentialById(credentialId, secret);
  const handleSubmit = async (credential: Partial<CredentialDto>) => {
    "use server";
    const result = await updateCredential(credentialId, credential, secret);

    if (result) {
      console.log("credential update was successful");
    }
  };

  return (
    <div className="flex max-w-full justify-center">
      <CredentialForm
        className="min-w-[90vw] md:min-w-[70vw] lg:min-w-[40vw]"
        credential={credential}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
