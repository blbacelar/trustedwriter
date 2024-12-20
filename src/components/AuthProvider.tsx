"use client";

import { useUser } from "@clerk/nextjs";
import { LanguageSelector } from "./LanguageSelector";

export const AuthProvider = () => {
  const { user } = useUser();

  if (user) return null;

  return <LanguageSelector />;
};
