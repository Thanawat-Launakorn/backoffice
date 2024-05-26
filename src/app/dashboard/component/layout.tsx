"use client";

import React, { useState } from "react";
import dashboardLayout from ".";
import { MenuProps } from "./sidebar";
import { usePathname, useRouter } from "next/navigation";
import layoutComponent from "@/app/components/layout";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { CgLogOut } from "react-icons/cg";

type LayoutAppProps = {
  children: React.ReactNode;
};

type Menu = "dashboard" | "product" | "deliver" | "logout";

export default function LayoutApp({ children }: LayoutAppProps) {
  const router = useRouter();
  const pathName = usePathname();
  const { Page } = layoutComponent;
  const { Nav, Sidebar } = dashboardLayout;

  const handleClickMenu = (menu: Menu) => {
    router.replace(`/${menu}`)
  };
  const menus: MenuProps[] = [
    {
      title: "Dashboard",
      prefix: <AiOutlineDashboard size={24} />,
      onPress: () => {
        handleClickMenu("dashboard");
      },
      isActive: pathName === "/dashboard",
    },
    {
      title: "Product",
      prefix: <IoFastFoodOutline size={24} />,
      onPress: () => {
        handleClickMenu("product");
      },
      isActive: pathName === "/product",
    },
    {
      title: "Deliver",
      prefix: <GoPerson size={24} />,
      onPress: () => {
        handleClickMenu("deliver");
      },
      isActive: pathName === "/deliver",
    },
  ];
  return (
    <Page>
      {/* sidebar */}
      <Sidebar menus={menus} />
      {/* content page */}
      <div className="p-4 xl:ml-80">
        {/* content header */}
        <Nav />
        {/* content page */}
        <div className="mt-12">{children}</div>
      </div>
    </Page>
  );
}
