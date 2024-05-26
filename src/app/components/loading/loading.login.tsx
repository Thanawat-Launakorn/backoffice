import React from "react";
import layoutComponent from "../layout";
type LoadingLoginProps = {
  children: React.ReactNode;
};
export default function LoadingLogin({ children }: LoadingLoginProps) {
  const { Page } = layoutComponent;
  return <Page>{children}</Page>;
}
