import { CreateCredentialDto, CredentialDto, createCredential } from "@/lib/services/credentials.service";
import CredentialForm from "../credentials-form";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default function NewCredentialPage() {
  if (!secret)
    return Response.json(
      { error: "Missing encryption secret" },
      { status: 500 },
    );

  const handleSubmit = async (credential: Partial<CredentialDto>) => {
    'use server'
    const result = await createCredential(credential as CreateCredentialDto, secret);
    if (result) {
      console.log(`credential create was successful. Id: ${result.id}`);
    }
  }

  return (
    <div className="flex max-w-full justify-center">
      <CredentialForm handleSubmit={handleSubmit} className="min-w-[90vw] md:min-w-[70vw] lg:min-w-[40vw]"/>
    </div>
  );
}
