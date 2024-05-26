import React from "react";

type PageProps = {
  children: React.ReactNode;
};

export default function Page({ children }: PageProps) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
