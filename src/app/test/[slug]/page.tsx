"use client";

import TestHeader from "@/app/test/[slug]/_components/test-header";
import React from "react";
import TestSidebar from "./_components/test-sidebar";
import TestFooter from "./_components/test-footer";
import TestContent from "./_components/test-content";

const TestPage = () => {
  return (
    <section className="h-screen flex flex-col">
      <TestHeader />
      <section className="flex-1 h-full flex flex-col-reverse md:flex-row overflow-y-auto">
        <TestContent />
        <TestSidebar />
      </section>
      <TestFooter />
    </section>
  );
};

export default TestPage;
