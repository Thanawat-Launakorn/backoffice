/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
"use client";
import { redirect } from "next/navigation";
import { storage } from "../helpers/storage";
import React, { ComponentType, useEffect } from "react";

function withAuth<T>(WrappedComponent: ComponentType<T>) {
  return (props: T) => {
    useEffect(() => {
      const token = storage.getToken();
      if (!token) {
        redirect("/login");
      }
    }, []);

    const token = storage.getToken();
    if (!token) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
