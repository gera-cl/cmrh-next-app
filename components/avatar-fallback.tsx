import React, { useState, useEffect } from "react";
import clsx from "clsx";

const popularColors: string[] = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-red-600",
  "bg-green-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-yellow-600",
  "bg-orange-600",
  "bg-indigo-600",
  "bg-teal-600",
];

const lightColors = [
  "bg-yellow-500",
  "bg-cyan-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
];

const getRandomColor = (): string => {
  return popularColors[Math.floor(Math.random() * popularColors.length)];
};

interface AvatarFallbackProps {
  letter: string;
  size?: number;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  letter,
  size = 20,
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>("bg-gray-500");

  useEffect(() => {
    setBackgroundColor(getRandomColor());
  }, []);

  const isLightColor = lightColors.includes(backgroundColor);

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full font-bold",
        backgroundColor,
        isLightColor ? "text-black" : "text-white",
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
      }}
    >
      {letter.toUpperCase()}
    </div>
  );
};
