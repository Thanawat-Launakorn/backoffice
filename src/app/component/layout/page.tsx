"use client";
import React from "react";
import layoutComponent from ".";
import { MenuProps } from "./sidebar";
import { GoPerson } from "react-icons/go";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoFastFoodOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";

type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  return <div className="min-h-screen bg-white">{children}</div>;
}

type SidebarProps = {
  children: React.ReactNode;
};

type Menu = "dashboard" | "product" | "deliver" | "logout";

export function SidebarPage({ children }: SidebarProps) {
  const router = useRouter();
  const pathName = usePathname();
  const { Page, AppHeader, AppSidebar } = layoutComponent;

  const handleClickMenu = (menu: Menu) => {
    router.replace(`/${menu}`);
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
      <AppSidebar menus={menus} />
      {/* content page */}
      <div className="p-4 xl:ml-80 flex flex-col min-h-screen">
        {/* content header */}
        <div className="flex-.5 pb-4">
          <AppHeader />
        </div>

        {children}
        {/* content page */}
      </div>
    </Page>
  );
}
