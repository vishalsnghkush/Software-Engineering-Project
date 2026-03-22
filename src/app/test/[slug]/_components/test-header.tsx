import { Chip, Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { TimerIcon } from "@phosphor-icons/react";
import React from "react";

const TestHeader = () => {
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarItem>
          <h1>Test</h1>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Chip startContent={<TimerIcon />} className="pl-2">
          12:34
        </Chip>
      </NavbarContent>
    </Navbar>
  );
};

export default TestHeader;
