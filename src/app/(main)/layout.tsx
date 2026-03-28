import React, { Suspense } from "react";
import MainHeader from "./_components/main-header";
import MainSidebar from "./_components/main-sidebar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { DEFAULT_GUEST_REDIRECT } from "../../../routes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
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
