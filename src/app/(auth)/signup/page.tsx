"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button, Form, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGGEDUSER_REDIRECT } from "../../../../routes";
import { signupSchema } from "@/lib/zod/signup";
import z from "zod";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUp: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    await authClient.signUp
      .email({
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: "/home",
      })
      .then((e) => {
        console.log("user:", e.data);
        if (e.error) {
          setError(e.error.message ?? "Error encountered");
        } else {
          router.push(DEFAULT_LOGGEDUSER_REDIRECT);
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e));
      });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div
        className="bg-indigo-400 px-8 py-6 md:p-12 flex flex-col justify-between
      relative overflow-hidden min-h-56"
      >
        <div className="flex items-center gap-2">
          <div className="text-2xl text-indigo-200">◈</div>
          <span className="text-lg font-medium text-white">SE Project</span>
        </div>

        <div className="">
          <h1 className="text-4xl leading-11 font-medium text-white font-stretch-semi-condensed">
            Practice smarter.
            <br />
            Perform better.
          </h1>
          <p className="text-sm text-indigo-100">
            AI-powered Computer Based Tests for JEE, GATE, CUET and more.
            Practice with real exam patterns and get personalised analysis.
          </p>
        </div>

        <div className="flex gap-6">
          {[
            { name: "JEE", sub: "Main & Advanced" },
            { name: "GATE", sub: "CS & ECE" },
            { name: "CUET", sub: "UG & PG" },
          ].map((ex) => (
            <div key={ex.name} className="flex flex-col gap-0.5">
              <span className="font-base font-medium text-indigo-100">
                {ex.name}
              </span>
              <span className="text-sm text-white opacity-50">{ex.sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-indigo-50 flex items-center justify-center flex-col p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-medium text-default-800 mb-1.5 leading-5 tracking-tight">
              Create an account
            </h2>
            <p className="text-sm text-indigo-500">
              Sign up to start your preparation journey
            </p>
          </div>

          <Form
            className="flex flex-col gap-4 mb-6"
            onSubmit={handleSubmit(onSignUp)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input label="Full Name" id="name" type="text" errorMessage={fieldState.error?.message} isInvalid={!!fieldState.error} {...field} />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input label="Email / User ID" id="email" type="text" errorMessage={fieldState.error?.message} isInvalid={!!fieldState.error} {...field} />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  label="Password"
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => setIsPasswordVisible((e) => !e)}
                    >
                      {isPasswordVisible ? (
                        <EyeIcon size={20} />
                      ) : (
                        <EyeClosedIcon size={20} />
                      )}
                    </Button>
                  }
                  {...field}
                />
              )}
            />
            {<p className="text-danger">{error}</p>}

            <Button isLoading={isSubmitting} type="submit" className="w-full" color="primary">
              Sign up
            </Button>
          </Form>

          <p className="text-indigo-700">
            Already have an account?{" "}
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
