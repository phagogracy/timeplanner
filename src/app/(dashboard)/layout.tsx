"use client";
import { AppBar, SideBarNavGroup, SideBarNavLink } from "@/core/ui/zenlots/src";
import { Logout, NotificationBing } from "iconsax-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="relative overflow-hidden">
      <AppBar
        onSideBarToggle={() => {
          setToggle(!toggle);
        }}
        leading={
          <Link href="/dashboard" className="w-10 ml-1 h-20 relative">
            <h1 className="text-white mt-7 w-48 font-semibold">TimePlanner</h1>
          </Link>
        }
      >
        <button
          className="w-9 h-9 bg-slate-700 rounded-md flex items-center justify-center"
          onClick={() => {
            signOut({ callbackUrl: "/login", redirect: true });
          }}
        >
          <Logout className="text-white" />
        </button>
      </AppBar>
      <div className="min-h-[calc(100vh-3.25rem)] gap-2 overflow-hidden">
        <div
          className={
            `bg-white min-w-[15rem] flex flex-col px-2 py-4 left-0 absolute top-[3.25rem] h-[calc(100vh-3.25rem)] overflow-y-auto custom-scrollbar ` +
            (toggle ? "" : "")
          }
        >
          <SideBarNavLink title="Dashboard" link="/dashboard" />
          <SideBarNavGroup title="Projects" segment="projects">
            <SideBarNavLink
              title="Add New Project"
              link="/projects/mutate/"
              linkExact
            />
            <SideBarNavLink
              title="All Projects"
              link="/projects/all"
              linkExact
            />
          </SideBarNavGroup>
          <SideBarNavGroup title="Tasks" segment="tasks">
            <SideBarNavLink
              title="Add New Task"
              link="/tasks/mutate/"
              linkExact
            />
            <SideBarNavLink
              title="All Tasks"
              link="/tasks/all"
              linkExact
            />
          </SideBarNavGroup>
          <div className="text-sm font-medium text-primaryGray-500 border-t my-2"></div>
          <SideBarNavGroup title="Users" segment="users">
            <SideBarNavLink
              title="Add New User"
              link="/users/mutate/"
              linkExact
            />
            <SideBarNavLink
              title="All Users"
              link="/users/all"
              linkExact
            />
          </SideBarNavGroup>
        </div>
        <div
          className={
            `bg-white flex-1 transition duration-200 ease-in-out absolute top-[3.25rem] w-[calc(100%-15.5rem)] max-lg:w-full h-[calc(100vh-3.25rem)] left-[15.5rem] overflow-y-auto custom-scrollbar ` +
            (toggle ? "max-lg:-translate-x-[15.5rem]" : "")
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
