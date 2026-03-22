"use client";

import { Button, Card, CardBody } from "@heroui/react";
import {
  ChartBarHorizontalIcon,
  ClipboardTextIcon,
  HouseSimpleIcon,
  IconBase,
} from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const MainSidebar = () => {
  return (
    <Card className="m-1" shadow="sm">
      <CardBody>
        <div className="flex md:flex-col gap-8 items-center justify-center">
          <Link href={"/home"} className="flex flex-col items-center">
            <HouseSimpleIcon size={20} />
            <p className="text-xs">Home</p>
          </Link>
          <Link href={"/history"} className="flex flex-col items-center">
            <ClipboardTextIcon size={20} />
            <p className="text-xs">History</p>
          </Link>
          <Link href={"/analysis"} className="flex flex-col items-center">
            <ChartBarHorizontalIcon size={20} />
            <p className="text-xs">Analysis</p>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default MainSidebar;
