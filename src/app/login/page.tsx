"use client";
import Image from "next/image";
import image from "../asset/image/image";
import React, { FormEvent } from "react";
import layoutComponent from "../component/layout";
import inputComponent from "../component/input";
import buttonComponent from "../component/button";
import typographyComponent from "../component/typography";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAtomValue, useSetAtom } from "jotai";
import loginAtomService from "../atom/login/loginAtomService";
import { LoginRequest } from "../models/request_body/loginRequestBody";
import { storage } from "../helpers/storage";
import headerAtomService from "../atom/headers";

export type LoginState = {
  message: string;
};

export default function Login() {
  const router = useRouter();
  const { setToken } = storage;
  const { Page } = layoutComponent;
  const { AppInput } = inputComponent;
  const { AppButton } = buttonComponent;
  const { rider, loadingLogin } = image;
  const controller = new AbortController();
  const { Typography } = typographyComponent;
  const fetchData = useSetAtom(loginAtomService.fetchData);
  const setHeader = useSetAtom(headerAtomService.setHeader);
  const isLoading = useAtomValue(loginAtomService.isLoading);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const body: LoginRequest = {
      email,
      password,
    };
    fetchData(controller.signal, body).then((res) => {
      if (Number(res.response_status) === 200) {
        if (res.role === "admin") {
          setToken(res.access_token);
          setHeader(res.access_token);
          router.replace("/dashboard");
        } else {
          Swal.fire({
            icon: "error",
            title: "Dont have permission!",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Email or password was wrong!",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <Image
          src={loadingLogin}
          alt="loading-image"
          objectFit="contain"
          fill
        />
      </div>
    );
  }

  return (
    <Page>
      <div className="flex h-screen">
        {/* image */}
        <div className="w-[40%] bg-green-500  justify-center items-center px-[50px] lg:flex hidden">
          <Image
            src={rider}
            alt="rider-image"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        {/* content login */}
        <div className="lg:w-[60%] w-screen bg-white flex justify-center items-center">
          <form onSubmit={onSubmit}>
            <div className="min-w-[350px]">
              <Typography
                title="Login"
                size="large"
                textOptions={{
                  textCase: "upper",
                  textAlign: "center",
                }}
              />
              <div className="my-8" />
              <AppInput name="email" label="Email" design="labelSpecial" />
              <div className="my-8" />
              <AppInput
                name="password"
                label="Password"
                design="labelSpecial"
              />
              <div className="my-8" />
              <AppButton title="Login" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}
