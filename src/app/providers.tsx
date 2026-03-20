"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider locale="en-IN">
      <ToastProvider toastOffset={50} placement="top-center" />
      {/* TODO: Verify best placement for toast */}
      {children}
    </HeroUIProvider>
  );
}
