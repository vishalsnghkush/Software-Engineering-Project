"use client";

import { signup } from "@/actions/temp/signup";
import { Button } from "@heroui/react";
import React from "react";

const SignupPage = () => {
  return (
    <div>
      <Button onPress={() => signup()}>Sign up</Button>
    </div>
  );
};

export default SignupPage;
