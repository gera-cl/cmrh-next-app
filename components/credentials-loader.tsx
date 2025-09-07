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
    // Determinar el tiempo de loading basado en si hay credenciales para procesar
    const hasCredentials = initialCredentials && initialCredentials.length > 0;
    const loadingTime = hasCredentials ? 300 : 150; // Menos tiempo si no hay nada que procesar
    
    const timer = setTimeout(() => {
      setCredentials(initialCredentials);
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [initialCredentials]);

  if (isLoading) {
    const hasCredentials = initialCredentials && initialCredentials.length > 0;
    const message = hasCredentials 
      ? "Decrypting your secure credentials..." 
      : "Loading credentials...";
    
    return <LoadingSpinner message={message} />;
  }

  return (
    <div>
      <CredentialsTable credentials={credentials} />
    </div>
  );
}
