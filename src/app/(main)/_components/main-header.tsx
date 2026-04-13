"use client";

import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { BrainIcon, UserCircleIcon, UserIcon } from "@phosphor-icons/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { DEFAULT_GUEST_REDIRECT } from "../../../../routes";

const MainHeader = () => {
  const { data, error, isPending } = authClient.useSession();
  const router = useRouter();

  // console.log(data);
  if (isPending || !data) return null;
  const { user, session } = data!;

  console.log("data:", data);
  console.log("error:", error);

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="gap-2">
          <BrainIcon size={20} />
          <h1 className="text-red">TCAS</h1>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Avatar
                showFallback
                src={user.image || undefined}
                fallback={<UserIcon size={20} />}
                className="cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 w-60">
                <div className="flex flex-col gap-1 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h3 className="text-sm font-semibold truncate leading-tight">
                    {user.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate leading-tight">
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    className="justify-start px-2 font-medium"
                    onPress={() => router.push("/profile")}
                  >
                    Manage Profile
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="justify-start px-2 font-medium"
                    onPress={() => {
                      authClient.signOut().then((e) => {
                        console.log(e.data);
                        router.push(DEFAULT_GUEST_REDIRECT);
                      });
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MainHeader;
