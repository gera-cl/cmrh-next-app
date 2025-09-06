"use client";

import { TbLoader2, TbKey } from "react-icons/tb";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ 
  message = "Loading credentials...", 
  size = "md" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl"
  };

  const containerClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${containerClasses[size]}`}>
      <div className="relative">
        <TbKey className={`${sizeClasses[size]} text-primary/30`} />
        <TbLoader2 className={`${sizeClasses[size]} text-primary absolute top-0 left-0 animate-spin`} />
      </div>
      <p className="text-default-600 animate-pulse font-medium">
        {message}
      </p>
      <div className="flex gap-1 mt-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
