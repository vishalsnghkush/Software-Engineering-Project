import React, { Suspense } from "react";
import MainHeader from "./_components/main-header";
import MainSidebar from "./_components/main-sidebar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { DEFAULT_GUEST_REDIRECT } from "../../../routes";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const { data, error } = await authClient.getSession();

  if (data && !data.user) {
    redirect(DEFAULT_GUEST_REDIRECT);
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <section className="flex flex-col h-screen">
        <MainHeader />
        <section
          className="overflow-auto flex flex-col-reverse md:flex-row
      w-full h-full"
        >
          <MainSidebar />
          <main className="flex-1 min-h-0 overflow-auto p-2">{children}</main>
        </section>
      </section>
    </Suspense>
  );
};

export default MainLayout;
