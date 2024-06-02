"use client";

import { storage } from "@/app/helpers/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
  React.useEffect(() => {
    const token = getToken();
    if (!token) {
        return router.replace('/login')
    }
    setAccessToken(token);
  }, [getToken]);

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
