"use client";

import { login } from "@/actions/temp/login";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DEFAULT_LOGGEDUSER_REDIRECT } from "../../../../routes";

const LoginPage = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    "use client";
    await authClient.signIn
      .email({
        email: "demo@demo.com",
        password: "DemoDemo@123",
        callbackURL: "/home",
      })
      .then((e) => {
        console.log("user:", e.data);
        console.log("error:", e.error);

        router.push(DEFAULT_LOGGEDUSER_REDIRECT);
      });
  };

  return (
    <div>
      <Button onPress={handleSignIn}>Log in</Button>
    </div>
  );
};

export default LoginPage;
