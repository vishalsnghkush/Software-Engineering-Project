import React from "react";
import MainHeader from "./_components/main-header";
import MainSidebar from "./_components/main-sidebar";

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
