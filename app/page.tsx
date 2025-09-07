import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Session } from "next-auth";

import CredentialsLoader from "@/components/credentials-loader";
import LoadingSpinner from "@/components/loading-spinner";
import { getCredentialsByUserId } from "@/lib/services/credentials.service";
import { getSession } from "@/lib/auth";

const secret = process.env.CMRH_ENCRYPTION_SECRET;

export default async function HomePage() {
  const session = (await getSession()) as Session | null;

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!secret) {
    throw Error("Missing encryption secret");
  }

  let data: any[] = [];

  if (session && session.user.id) {
    data = await getCredentialsByUserId(session.user.id, secret)();
    data = data.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <Suspense
      fallback={<LoadingSpinner message="Loading your secure credentials..." />}
    >
      <CredentialsLoader initialCredentials={data} />
    </Suspense>
  );
}
