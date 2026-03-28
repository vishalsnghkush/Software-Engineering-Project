"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { DEFAULT_LOGGEDUSER_REDIRECT } from "../../../../routes";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();

  const handleSignUp = async () => {
    await authClient.signUp
      .email({
        email: "demo@demo.com",
        name: "Demo",
        password: "DemoDemo@123",
      })
      .then((e) => {
        console.log("user:", e.data);
        console.log("error:", e.error);

        router.push(DEFAULT_LOGGEDUSER_REDIRECT);
      });
  };

  return (
    <div>
      <Button onPress={handleSignUp}>Sign up</Button>
    </div>
  );
};

export default SignupPage;
