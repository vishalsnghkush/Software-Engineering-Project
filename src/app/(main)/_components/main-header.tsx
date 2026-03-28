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
import { UserCircleIcon, UserIcon } from "@phosphor-icons/react";
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
        <NavbarBrand>
          <h1 className="text-red">SE Project</h1>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Avatar
                showFallback
                // tabIndex={10}
                fallback={<UserIcon size={20} />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>{user.email}</p>
                <Button
                  className="mt-2"
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
            </PopoverContent>
          </Popover>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MainHeader;
