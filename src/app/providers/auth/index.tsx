"use client";
import { storage } from "@/app/helpers/storage";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContext = {
  access_token: string;
};

const AuthContext = createContext<AuthContext>({ access_token: "" });
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string>("");
  const value: AuthContext = { access_token: token };
  const router = useRouter();
  const { getToken } = storage;
  useEffect(() => {
    const loadToken = getToken();
    if (loadToken) {
      setToken(loadToken);
    }
  }, []);

  useEffect(() => {
    console.log('token', token);
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    }
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

const authProvider = {
  useAuth,
  AuthContext,
  AuthProvider,
};

export default authProvider;
