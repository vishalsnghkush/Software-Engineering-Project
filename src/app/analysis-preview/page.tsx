"use client";

import React from "react";
import { LandingNavbar, LandingFooter } from "@/components/landing-shared";
import { Card, CardBody } from "@heroui/react";
import { Target, Timer, Brain, TrendUp } from "@phosphor-icons/react";

export default function AnalysisPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <LandingNavbar />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl text-center mx-auto">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Deep Insights</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Performance Criteria</p>
            <p className="mt-4 text-slate-600 text-lg">Detailed analytical breakdown to identify areas of improvement and help you achieve your goals.</p>
          </div>
          
          {/* Dashboard Visual Placeholder */}
          <div className="mt-8 w-full max-w-4xl mx-auto rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-900/5">
            <div className="rounded-lg overflow-hidden flex flex-col md:flex-row border border-slate-100">
              <div className="p-12 md:w-1/3 border-r border-slate-100 flex flex-col justify-center items-center text-center bg-slate-50">
                 <div className="w-40 h-40 rounded-full border-8 border-indigo-500 flex items-center justify-center mb-6 shadow-inner bg-white">
                    <span className="text-5xl font-bold text-indigo-600">85%</span>
                 </div>
                 <h3 className="font-bold text-slate-800 text-xl">Accuracy Score</h3>
                 <p className="text-sm text-slate-500 mt-2">Your performance places you in the top 10% of aspirants.</p>
              </div>
              <div className="p-8 md:w-2/3 grid grid-cols-2 gap-6 items-center">
                {[
                  { label: "Questions Attempted", val: "120", icon: <Target size={28} className="text-blue-500"/> },
                  { label: "Average Time/Qs", val: "45s", icon: <Timer size={28} className="text-orange-500"/> },
                  { label: "Tests Generated", val: "12", icon: <Brain size={28} className="text-purple-500"/> },
                  { label: "Weakness Areas", val: "3", icon: <TrendUp size={28} className="text-red-500"/> }
                ].map((stat, i) => (
                  <Card key={i} shadow="none" className="border border-slate-100 bg-slate-50/50 h-full">
                    <CardBody className="p-6 flex flex-row items-center gap-4">
                      <div className="p-4 bg-white rounded-xl shadow-sm">{stat.icon}</div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-800">{stat.val}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
