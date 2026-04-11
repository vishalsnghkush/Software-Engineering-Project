"use client";

import React from "react";
import { LandingNavbar, LandingFooter } from "@/components/landing-shared";
import { NotePencil, Target, CheckCircle, TrendUp } from "@phosphor-icons/react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-white">
      <LandingNavbar />
      <main className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Streamlined Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">How TCAS Works</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mt-16">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10"></div>
            {[
              { step: "1", title: "Select or Generate", desc: "Choose a past paper or let AI build a custom test for you.", icon: <NotePencil size={28} className="text-indigo-400" /> },
              { step: "2", title: "Attempt CBT", desc: "Take the test in our strict, fast-loading examination interface.", icon: <Target size={28} className="text-indigo-400" /> },
              { step: "3", title: "Instant Results", desc: "Submit and immediately view your raw performance metrics.", icon: <CheckCircle size={28} className="text-indigo-400" /> },
              { step: "4", title: "View AI Analysis", desc: "Read deep, AI-generated insights on how to improve your score.", icon: <TrendUp size={28} className="text-indigo-400" /> }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 p-6 rounded-2xl hover:bg-slate-800 transition-colors">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center mb-6 shadow-xl relative">
                   {s.icon}
                   <div className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold border-2 border-slate-900">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
