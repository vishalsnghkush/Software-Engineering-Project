"use client";

import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { UserCircleIcon, UserIcon } from "@phosphor-icons/react";
import React from "react";

const MainHeader = () => {
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand>
          <h1 className="text-red">SE Project</h1>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Avatar showFallback fallback={<UserIcon size={20} />}></Avatar>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MainHeader;
