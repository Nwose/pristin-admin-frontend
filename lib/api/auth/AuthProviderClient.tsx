"use client";

import { useRouter } from "next/navigation";
import { AuthProvider } from "./authContext";
import { Routes } from "../FrontendRoutes";

export function AuthProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AuthProvider
      onLogout={() => {
        console.log("User logged out");
        router.push(Routes.login);
      }}
    >
      {children}
    </AuthProvider>
  );
}
