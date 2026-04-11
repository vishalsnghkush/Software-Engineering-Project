"use client";

import React from "react";
import { LandingNavbar, LandingFooter } from "@/components/landing-shared";
import { Brain, MonitorPlay, ChartBar, Lightbulb } from "@phosphor-icons/react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <LandingNavbar />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Built for Excellence</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to ace your exams</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI Question Generation", desc: "Model 1 automatically creates tailored question papers matching syllabus complexity and pattern.", icon: <Brain size={32} weight="duotone" className="text-indigo-600" /> },
              { title: "Real CBT Simulation", desc: "Practice in an authentic layout identical to real-world competitive examinations.", icon: <MonitorPlay size={32} weight="duotone" className="text-blue-600" /> },
              { title: "Instant Reports", desc: "Receive accuracy, time-spent, and attempt-level metrics the millisecond you submit.", icon: <ChartBar size={32} weight="duotone" className="text-emerald-600" /> },
              { title: "AI Weakness Analysis", desc: "Model 2 intelligently scans your history to pinpoint conceptual gaps and recommendations.", icon: <Lightbulb size={32} weight="duotone" className="text-amber-500" /> }
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-4 p-8 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-colors border border-slate-100 shadow-sm">
                <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
