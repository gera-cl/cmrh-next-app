import { redirect } from "next/navigation";

import PasswordGeneratorForm from "./password-generator-form";

import { getSession } from "@/lib/auth";

export default async function PasswordGeneratorPage() {
  const session = await getSession();

  if (!session) redirect("/api/auth/signin");

  return (
    <div className="flex max-w-full justify-center min-h-screen bg-background py-4">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Password Generator
          </h1>
          <p className="text-base md:text-lg text-foreground-600">
            Generate secure passwords with customizable options
          </p>
        </div>
        <PasswordGeneratorForm />
      </div>
    </div>
  );
}
