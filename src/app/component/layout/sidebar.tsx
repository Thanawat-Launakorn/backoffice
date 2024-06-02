import React from "react";

export type MenuProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
  prefix: React.ReactNode;
};

export type SidebarProps = {
  menus: MenuProps[];
};

export default function AppSidebar({ menus }: SidebarProps) {
  const ButtonSidebar = (
    title: string,
    isActive: boolean,
    onPress: () => void,
    prefix: React.ReactNode,
    key: string
  ) => {
    const activeButtonClass =
      "middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize";

    const inActiveButtonClass =
      "middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize";

    return (
      <li key={key}>
        <button
          onClick={onPress}
          className={isActive ? activeButtonClass : inActiveButtonClass}
          type="button"
        >
          {prefix}
          <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
            {title}
          </p>
        </button>
      </li>
    );
  };

  return (
    <aside className="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
      <div className="relative border-b border-white/20">
        <a className="flex items-center gap-4 py-6 px-8" href="#/">
          <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
            ADMINDASHBOARD
          </h6>
        </a>
      </div>
      <div className="m-4">
        <ul className="mb-4 flex flex-col gap-1">
          {menus.map((menu) => {
            const { title, isActive, onPress, prefix } = menu;
            return ButtonSidebar(title, isActive, onPress, prefix, title);
          })}
        </ul>
      </div>
    </aside>
  );
}
