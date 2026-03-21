import MainHeader from "@/components/main-header";
import MainSidebar from "@/components/main-sidebar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
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
  );
};

export default MainLayout;
