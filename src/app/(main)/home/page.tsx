"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1 className="font-bold text-2xl">Home</h1>

      <Link href={"/test/0"}>
        <Button>Test</Button>
      </Link>
    </div>
  );
};

export default HomePage;
