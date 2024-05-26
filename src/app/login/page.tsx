"use client";
import Image from "next/image";
import Swal from "sweetalert2";
import { InputValues } from "../types";
import image from "../assets/image/image";
import { useRouter } from "next/navigation";
import { storage } from "../helpers/storage";
import { useAtomValue, useSetAtom } from "jotai";
import inputComponent from "../components/input";
import layoutComponent from "../components/layout";
import buttonComponent from "../components/button";
import React, { useEffect, useState } from "react";
import typographyComponent from "../components/typography";
import loginAtomService from "../atoms/login/loginAtomService";
import { LoginRequest } from "../models/request_body/loginRequestBody";

export default function Login() {
  const router = useRouter();
  const { Page } = layoutComponent;
  const { AppInput } = inputComponent;
  const { AppButton } = buttonComponent;
  const { rider, loadingLogin } = image;
  const { setToken, clearToken } = storage;
  const { Typography } = typographyComponent;
  const controller = new AbortController();
  const fetchData = useSetAtom(loginAtomService.fetchData);
  const isLoading = useAtomValue(loginAtomService.isLoading);
  const [inputValues, setInputValues] = useState<
    InputValues<keyof LoginRequest>
  >({
    email: { value: "" },
    password: { value: "" },
  });

  const onChangeHandler = React.useCallback(
    (identifier: string, value: string) => {
      setInputValues({
        ...inputValues,
        [identifier]: { value },
      });
    },
    [inputValues]
  );

  const onPressLogin = () => {
    const { email: inputEmail, password: inputPassword } = inputValues;
    const body: LoginRequest = {
      email: inputEmail.value,
      password: inputPassword.value,
    };
    fetchData(controller.signal, body).then((res) => {
      if (res.response_status === 200) {
        const { access_token } = res;
        setToken(access_token);
        router.push("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Email or password is wrong!",
          text: "Please check again",
          confirmButtonColor: "green",
        });
      }
    });
  };

  useEffect(() => {
    setInputValues({
      email: { value: "john@gmail.com" },
      password: { value: "changeme" },
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <Image
          src={loadingLogin}
          alt="gif-loading"
          width={500}
          height={500}
          objectFit="cover"
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

            <AppInput
              label="Email"
              design="labelSpecial"
              value={inputValues.email.value}
              onChange={(e) => onChangeHandler("email", e.target.value)}
            />
            <div className="my-8" />
            <AppInput
              label="Password"
              design="labelSpecial"
              value={inputValues.password.value}
              onChange={(e) => onChangeHandler("password", e.target.value)}
            />
            <div className="my-8" />
            <AppButton title="login" onPress={onPressLogin} />
          </div>
        </div>
      </div>
    </Page>
  );
}
