"use client";

import React, { useState, useEffect } from "react";
import TestGenerator from "@/components/TestGenerator";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  MagnifyingGlass,
  Lightning,
  CaretRight,
  ArrowRight,
  BookOpen,
} from "@phosphor-icons/react";
import { Question } from "@/db/schema/questions";
import { QuestionPaper } from "@/db/schema/questionPapers";
import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/navigation";

interface AutoGenConfig {
  examName: string;
  subject: string;
  numQuestions: number;
  difficulty?: string;
}

const PRESET_TESTS = [
  {
    exam: "JEE",
    subject: "Current Electricity",
    questions: 5,
    time: 60,
    difficulty: "Medium",
  },
  {
    exam: "GATE",
    subject: "Data Structures",
    questions: 5,
    time: 40,
    difficulty: "Medium",
  },
  {
    exam: "JEE",
    subject: "Organic Chemistry",
    questions: 5,
    time: 45,
    difficulty: "Hard",
  },
  {
    exam: "CUET",
    subject: "Calculus",
    questions: 5,
    time: 40,
    difficulty: "Medium",
  },
];

const DISCOVER_TESTS = [
  {
    exam: "JEE",
    subject: "Thermodynamics",
    questions: 5,
    time: 60,
    difficulty: "Hard",
  },
  {
    exam: "GATE",
    subject: "Dynamic Programming",
    questions: 5,
    time: 30,
    difficulty: "Medium",
  },
  {
    exam: "JEE",
    subject: "Probability",
    questions: 5,
    time: 40,
    difficulty: "Medium",
  },
  {
    exam: "CUET",
    subject: "Reading Comprehension",
    questions: 5,
    time: 30,
    difficulty: "Easy",
  },
  {
    exam: "JEE",
    subject: "Chemical Bonding",
    questions: 5,
    time: 40,
    difficulty: "Medium",
  },
  {
    exam: "GATE",
    subject: "Operating Systems",
    questions: 5,
    time: 40,
    difficulty: "Hard",
  },
  {
    exam: "JEE",
    subject: "Kinematics",
    questions: 5,
    time: 30,
    difficulty: "Easy",
  },
];

const EXAM_TABS = [
  "All",
  "JEE",
  "GATE",
  "CUET",
  "Physics",
  "Chemistry",
  "Maths",
];

const EXAM_COLORS: Record<string, string> = {
  JEE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GATE: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  CUET: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  NEET: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const HomePage = () => {
  const [view, setView] = useState<"dashboard" | "create" | "autotest">(
    "dashboard",
  );
  const [autoConfig, setAutoConfig] = useState<AutoGenConfig | null>(null);
  const [userName, setUserName] = useState("Student");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const router = useRouter();

  const fetcher: Fetcher<{ questionPaper: QuestionPaper }[]> = (
    ...args: Parameters<typeof fetch>
  ) =>
    fetch(...args).then((res) =>
      res.json().then((obj) => obj.questionPaperList),
    );

  const { data, isLoading } = useSWR("/api/ongoing-tests", fetcher, {
    onError: () => {},
    onSuccess: () => {},
  });

  useEffect(() => {
    authClient
      .getSession()
      .then((session) => {
        if (session?.data?.user?.name) setUserName(session.data.user.name);
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    return "Welcome Back";
  };

  const filteredTests = DISCOVER_TESTS.filter((test) => {
    const matchesSearch =
      !searchQuery ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      test.exam.toLowerCase().includes(activeTab.toLowerCase()) ||
      test.subject.toLowerCase().includes(activeTab.toLowerCase());
    return matchesSearch && matchesTab;
  });

  const handlePresetClick = (test: {
    exam: string;
    subject: string;
    questions: number;
    difficulty: string;
  }) => {
    setAutoConfig({
      examName: test.exam,
      subject: test.subject,
      numQuestions: test.questions,
      difficulty:
        test.difficulty === "Hard"
          ? "hard"
          : test.difficulty === "Easy"
            ? "easy"
            : "actual experience as in actual paper",
    });
    setView("autotest");
  };

  if (view === "create") {
    return (
      <div className="w-full h-full pb-20">
        <button
          onClick={() => setView("dashboard")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 ml-6 mt-4 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <TestGenerator />
      </div>
    );
  }

  if (view === "autotest" && autoConfig) {
    return (
      <div className="w-full h-full pb-20">
        <button
          onClick={() => {
            setView("dashboard");
            setAutoConfig(null);
          }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 ml-6 mt-4 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <TestGenerator
          key={JSON.stringify(autoConfig)}
          autoGenerate={autoConfig}
          onBack={() => {
            setView("dashboard");
            setAutoConfig(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-[#0b1120]">
      {/* Hero */}
      <div className="px-6 py-8 md:px-10 md:py-10 border-b border-slate-800">
        <p className="text-slate-400 text-sm font-medium mb-1">
          {getGreeting()}, {userName}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">
          Ready to practice?
        </h1>
        <p className="text-slate-500 text-sm">
          Pick a preset test or generate one with AI
        </p>
      </div>

      <div className="px-6 md:px-10 py-6 space-y-8">
        {/* Create with AI */}
        <button
          onClick={() => setView("create")}
          className="w-full flex items-center justify-between bg-[#111827] hover:bg-[#1a2332] border border-slate-700/50 hover:border-blue-500/40 rounded-xl px-5 py-4 group transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Plus size={20} weight="bold" className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Create with AI</p>
              <p className="text-slate-500 text-xs">Custom question paper</p>
            </div>
          </div>
          <CaretRight
            size={16}
            className="text-slate-600 group-hover:text-blue-400 transition-colors"
          />
        </button>

        {/* Recommended */}
        <div>
          <h2 className="text-base font-semibold text-slate-300 mb-4">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_TESTS.map((test, idx) => (
              <div
                key={idx}
                className="bg-[#111827] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 cursor-pointer transition-all group"
                onClick={() => handlePresetClick(test)}
              >
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-3 ${EXAM_COLORS[test.exam] || EXAM_COLORS.JEE}`}
                >
                  {test.exam}
                </span>
                <h3 className="text-white font-semibold text-sm mb-1">
                  {test.subject}
                </h3>
                <p className="text-slate-500 text-xs mb-3">
                  {test.questions} Qs · {test.time} min
                </p>
                <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                  Start test{" "}
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
        {}
        {data && data.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-slate-300 mb-4">
              Continue where you left off
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.map((oldTest, idx) => {
                const test = oldTest.questionPaper;
                return (
                  <div
                    key={idx}
                    className="bg-[#111827] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 cursor-pointer transition-all group"
                    onClick={() => router.push(`/test/${test.id}`)}
                  >
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-3 ${EXAM_COLORS[test.name] || EXAM_COLORS.JEE}`}
                    >
                      {test.name}
                    </span>
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {test.subject}
                    </h3>

                    <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      Start test{" "}
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Discover */}
        <div>
          <h2 className="text-base font-semibold text-slate-300 mb-4">
            Discover
          </h2>
          <div className="relative mb-3">
            <MagnifyingGlass
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              type="text"
              placeholder="Search tests or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:border-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {EXAM_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {filteredTests.map((test, idx) => (
              <div
                key={idx}
                onClick={() => handlePresetClick(test)}
                className="flex items-center justify-between bg-[#111827]/50 border border-slate-800/50 rounded-lg px-4 py-3 hover:bg-[#111827] hover:border-slate-700/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                    <BookOpen
                      size={14}
                      className="text-slate-500 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${EXAM_COLORS[test.exam] || EXAM_COLORS.JEE}`}
                      >
                        {test.exam}
                      </span>
                      <span className="text-white font-medium text-sm">
                        {test.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span>{test.questions} Qs</span>
                      <span>·</span>
                      <span>{test.time} min</span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${test.difficulty === "Hard" ? "text-red-400/70" : test.difficulty === "Easy" ? "text-emerald-400/70" : "text-amber-400/70"}`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-700 group-hover:text-slate-400 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
