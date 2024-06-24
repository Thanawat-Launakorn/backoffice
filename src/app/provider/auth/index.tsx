"use client";

import { storage } from "@/app/helpers/storage";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

type AuthContextProps = {
  accessToken: string | null;
};
type AuthProviderProps = {
  children: React.ReactNode;
};

const initAuth: AuthContextProps = {
  accessToken: "",
};
const AuthContext = React.createContext<AuthContextProps>(initAuth);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>("");
  const { getToken } = storage;
  const router = useRouter();
  const signOut = useCallback(() => router.replace("/login"), []);
  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      return router.replace("/login");
    }
    setAccessToken(token);
  }, [getToken]);

  React.useEffect(() => {
    const timeout = setTimeout(signOut, 30 * 60 * 2000); // expire in 60 minutes
    return () => clearTimeout(timeout);
  }, [signOut]);

  const value = {
    accessToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const authProvider = {
  AuthContext,
  AuthProvider,
};

export default authProvider;
