"use client";

import { useEffect, useState } from "react";
import CredentialsTable from "@/app/credentials/credentials-table";
import LoadingSpinner from "@/components/loading-spinner";
import { CredentialDto } from "@/lib/services/credentials.service";

interface CredentialsLoaderProps {
  initialCredentials: CredentialDto[];
}

export default function CredentialsLoader({ initialCredentials }: CredentialsLoaderProps) {
  const [credentials, setCredentials] = useState<CredentialDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular un pequeño delay para mostrar la animación de loading
    // y luego cargar las credenciales
    const timer = setTimeout(() => {
      setCredentials(initialCredentials);
      setIsLoading(false);
    }, 800); // 800ms para una experiencia suave

    return () => clearTimeout(timer);
  }, [initialCredentials]);

  if (isLoading) {
    return <LoadingSpinner message="Decrypting your secure credentials..." />;
  }

  return (
    <div>
      <CredentialsTable credentials={credentials} />
    </div>
  );
}
