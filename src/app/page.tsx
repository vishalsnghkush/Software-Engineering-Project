"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";
import { 
  Brain, 
  TrendUp, 
  Timer, 
  Target, 
  CaretRight,
  Lightning
} from "@phosphor-icons/react";
import { LandingNavbar, LandingFooter } from "@/components/landing-shared";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. NAVBAR */}
      <LandingNavbar />

      <main className="flex-grow">
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-8">
              <Lightning size={16} weight="fill" /> SRS Validated Platform
            </div>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">AI-Powered</span> Test Preparation
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Experience real CBT simulation with dynamic question generation and instant performance insights. Practice smarter, not harder.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button as={Link} href="/signup" color="primary" size="lg" className="font-semibold shadow-md px-8">
                Start Test <CaretRight weight="bold" />
              </Button>
              <Button as={Link} href="/login" variant="flat" color="primary" size="lg" className="font-semibold px-8 bg-indigo-50">
                Generate Test
              </Button>
            </div>
            {/* Dashboard Visual Placeholder */}
            <div className="mt-16 w-full max-w-5xl rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 shadow-2xl">
              <div className="rounded-lg bg-white ring-1 ring-slate-900/5 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 md:w-1/3 border-r border-slate-100 flex flex-col justify-center items-center text-center bg-slate-50">
                   <div className="w-32 h-32 rounded-full border-8 border-indigo-500 flex items-center justify-center mb-4 shadow-inner">
                      <span className="text-4xl font-bold text-indigo-600">85%</span>
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">Accuracy Score</h3>
                   <p className="text-sm text-slate-500 mt-2">Your performance places you in the top 10% of aspirants.</p>
                </div>
                <div className="p-8 md:w-2/3 grid grid-cols-2 gap-4">
                  {[
                    { label: "Questions Attempted", val: "120", icon: <Target size={24} className="text-blue-500"/> },
                    { label: "Average Time/Qs", val: "45s", icon: <Timer size={24} className="text-orange-500"/> },
                    { label: "Tests Generated", val: "12", icon: <Brain size={24} className="text-purple-500"/> },
                    { label: "Weakness Areas", val: "3", icon: <TrendUp size={24} className="text-red-500"/> }
                  ].map((stat, i) => (
                    <Card key={i} shadow="none" className="border border-slate-100 bg-slate-50/50">
                      <CardBody className="p-4 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">{stat.icon}</div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                          <p className="text-xl font-bold text-slate-800">{stat.val}</p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <LandingFooter />
    </div>
  );
}
