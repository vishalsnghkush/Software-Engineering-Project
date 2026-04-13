"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import QuestionButton from "@/components/question-button";
import { QuestionStatus } from "@/lib/enums/question-status";
import {
  Button,
  Chip,
  Navbar,
  NavbarContent,
  NavbarItem,
  Radio,
  RadioGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { TimerIcon, InfoIcon } from "@phosphor-icons/react";
import Link from "next/link";

type AppState = "setup" | "generating" | "ready" | "testing" | "results";

interface AutoGenConfig {
  examName: string;
  subject: string;
  numQuestions: number;
  difficulty?: string;
}

interface TestGeneratorProps {
  autoGenerate?: AutoGenConfig;
  onBack?: () => void;
}

const API_KEY_STORAGE_KEY = "tcas_openrouter_api_key";
const DEFAULT_API_KEY =
  "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";

export default function TestGenerator({
  autoGenerate,
  onBack,
}: TestGeneratorProps = {}) {
  // ─── Persisted API Key ───
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved) setApiKey(saved);
    else localStorage.setItem(API_KEY_STORAGE_KEY, DEFAULT_API_KEY);
  }, []);
  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem(API_KEY_STORAGE_KEY, val);
  };

  // ─── Setup State ───
  const [examName, setExamName] = useState(autoGenerate?.examName || "JEE");
  const [generationType, setGenerationType] = useState("Topic Wise");
  const [subject, setSubject] = useState(autoGenerate?.subject || "");
  const [difficulty, setDifficulty] = useState(
    autoGenerate?.difficulty || "actual experience as in actual paper",
  );
  const [numQuestions, setNumQuestions] = useState<number>(
    autoGenerate?.numQuestions || 5,
  );

  useEffect(() => {
    if (generationType === "Subject Wise") {
      if (
        examName === "JEE" &&
        !["Physics", "Chemistry", "Mathematics"].includes(subject)
      )
        setSubject("Physics");
      else if (
        examName === "NEET" &&
        !["Physics", "Chemistry", "Biology"].includes(subject)
      )
        setSubject("Physics");
    }
  }, [examName, generationType, subject]);

  // ─── Core State ───
  const [appState, setAppState] = useState<AppState>("setup");
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionLink, setquestionLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(
    new Set(),
  );
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [scoreData, setScoreData] = useState({
    marks: 0,
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    correctMark: 4,
    incorrectMark: 1,
    maxMarks: 20,
  });

  const [savedRes, setSavedRes] = useState<any>(null);

  // ─── Generate ───
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState("generating");
    setError("");
    setQuestions([]);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set());
    setCurrentQ(0);

    let finalNumQuestions = numQuestions;
    let finalSubject = subject;

    if (generationType === "Complete Paper") {
      finalSubject = "Complete Syllabus";
      if (examName === "JEE") finalNumQuestions = 75;
      else if (examName === "NEET") finalNumQuestions = 200;
      else if (examName === "CUET") finalNumQuestions = 50;
      else if (examName === "GATE") finalNumQuestions = 65;
    }

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          examName,
          generationType,
          difficulty,
          subject: finalSubject,
          numQuestions: finalNumQuestions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (generationType === "Complete Paper" && res.status === 500) {
          throw new Error(
            "Free tier limit exceeded for generating a complete paper. Try a smaller 'Topic Wise' test or use a paid model.",
          );
        }
        throw new Error(data.error || "Generation failed.");
      }

      console.log("This is the received response");
      console.log(res);
      setSavedRes(res);

      setQuestions(data.questions || []);
      setquestionLink(data.questionPaperId);
      setAppState("ready");
    } catch (err: any) {
      setError(err.message);
      setAppState("setup");
    }
  };

  const calculateTimeLimit = (examName: string, qCount: number) => {
    if (examName === "JEE") return Math.floor(qCount * ((180 * 60) / 75));
    else if (examName === "NEET")
      return Math.floor(qCount * ((200 * 60) / 200));
    else if (examName === "CUET") return Math.floor(qCount * ((60 * 60) / 50));
    else if (examName === "GATE") return Math.floor(qCount * ((180 * 60) / 65));
    else return qCount * 120;
  };

  // ─── Start Test in CBT Mode ───
  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {}

    setAppState("testing");
    setUserAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set([0]));
    setCurrentQ(0);

    const qCount = questions.length;
    let totalSeconds = 0;
    if (examName === "JEE")
      totalSeconds = Math.floor(qCount * ((180 * 60) / 75));
    else if (examName === "NEET")
      totalSeconds = Math.floor(qCount * ((200 * 60) / 200));
    else if (examName === "CUET")
      totalSeconds = Math.floor(qCount * ((60 * 60) / 50));
    else if (examName === "GATE")
      totalSeconds = Math.floor(qCount * ((180 * 60) / 65));
    else totalSeconds = qCount * 120;
    setTimeLeft(totalSeconds);
  };

  // ─── Auto-Generate on mount if autoGenerate is provided ───
  const autoTriggered = useRef(false);
  useEffect(() => {
    if (autoGenerate && !autoTriggered.current) {
      autoTriggered.current = true;
      setAppState("generating");
      setError("");
      setQuestions([]);
      setUserAnswers({});
      setMarkedForReview(new Set());
      setVisitedQuestions(new Set());
      setCurrentQ(0);

      fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          examName: autoGenerate.examName,
          timeLimit: calculateTimeLimit(
            autoGenerate.examName,
            autoGenerate.numQuestions,
          ),
          generationType: "Topic Wise",
          difficulty:
            autoGenerate.difficulty || "actual experience as in actual paper",
          subject: autoGenerate.subject,
          numQuestions: autoGenerate.numQuestions,
        }),
      })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (!ok) throw new Error(data.error || "Generation failed.");
          setSavedRes(data);
          setquestionLink(data.questionPaperId);
          setQuestions(data.questions || []);
          setAppState("ready");
        })
        .catch((err: any) => {
          setError(err.message);
          setAppState("setup");
        });
    }
  }, [autoGenerate, apiKey]);

  // Auto-start test when questions are ready in auto-generate mode
  useEffect(() => {
    if (autoGenerate && appState === "ready" && questions.length > 0) {
      // startTest();
    }
  }, [autoGenerate, appState, questions]);

  // ─── Timer ───
  useEffect(() => {
    if (appState === "testing" && timeLeft !== null && timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(id);
    } else if (appState === "testing" && timeLeft === 0) {
      submitTest();
    }
  }, [timeLeft, appState]);

  // ─── Anti-cheat ───
  useEffect(() => {
    if (appState !== "testing") return;
    const onVis = () => {
      if (document.visibilityState === "hidden") submitTest();
    };
    const onFs = () => {
      if (!document.fullscreenElement) submitTest();
    };
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [appState, userAnswers, questions]);

  const formatTime = (s: number | null) => {
    if (s === null) return "";
    const h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      sec = s % 60;
    const parts = [];
    if (h > 0) parts.push(h < 10 ? "0" + h : h);
    parts.push(m < 10 ? "0" + m : m);
    parts.push(sec < 10 ? "0" + sec : sec);
    return parts.join(":");
  };

  // ─── Question Navigation & Actions ───
  const goToQuestion = (idx: number) => {
    setCurrentQ(idx);
    setVisitedQuestions((prev) => new Set(prev).add(idx));
  };

  const handleSelectOption = (optionValue: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ]: optionValue }));
  };

  const handleClear = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ];
      return copy;
    });
  };

  const handleMarkAndNext = () => {
    setMarkedForReview((prev) => new Set(prev).add(currentQ));
    if (currentQ < questions.length - 1) goToQuestion(currentQ + 1);
  };

  const handleSaveAndNext = () => {
    if (currentQ < questions.length - 1) goToQuestion(currentQ + 1);
  };

  // ─── Submit ───
  const submitTest = useCallback(() => {
    let marks = 0,
      correct = 0,
      incorrect = 0,
      unattempted = 0;
    let correctMark = 4,
      incorrectMark = 1;
    if (examName === "CUET") {
      correctMark = 5;
      incorrectMark = 1;
    } else if (examName === "GATE") {
      correctMark = 1;
      incorrectMark = 0.33;
    }

    questions.forEach((q, idx) => {
      const uA = userAnswers[idx],
        cA = q.correctAnswer || "";
      if (!uA) unattempted++;
      else if (uA === cA) {
        correct++;
        marks += correctMark;
      } else {
        incorrect++;
        marks -= incorrectMark;
      }
    });
    if (examName === "GATE") marks = parseFloat(marks.toFixed(2));

    setScoreData({
      marks,
      correct,
      incorrect,
      unattempted,
      correctMark,
      incorrectMark,
      maxMarks: questions.length * correctMark,
    });
    setAppState("results");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    // Save to PostgreSQL via API
    try {
      fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examName,
          generationType,
          subject: subject || "General",
          difficulty,
          totalQuestions: questions.length,
          marks,
          maxMarks: questions.length * correctMark,
          correct,
          incorrect,
          unattempted,
          accuracy:
            questions.length > 0
              ? Math.round((correct / questions.length) * 100)
              : 0,
        }),
      }).catch((e) => {
        throw new Error(e);
      });
    } catch {}
  }, [questions, userAnswers, examName, generationType, subject, difficulty]);

  const resetGenerator = () => {
    setAppState("setup");
    setQuestions([]);
    setUserAnswers({});
    setTimeLeft(null);
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set());
    setCurrentQ(0);
  };

  // ─── Question Status Helper ───
  const getQuestionStatus = (idx: number): QuestionStatus => {
    const answered = userAnswers[idx] !== undefined;
    const marked = markedForReview.has(idx);
    const visited = visitedQuestions.has(idx);
    if (answered && marked) return QuestionStatus.AnsweredMarked;
    if (marked) return QuestionStatus.Marked;
    if (answered) return QuestionStatus.Answered;
    if (visited) return QuestionStatus.NotAnswered;
    return QuestionStatus.NotVisited;
  };

  // ════════════════════════════════════════════════════════════════════
  //                        R E N D E R
  // ════════════════════════════════════════════════════════════════════

  // ─── SETUP / GENERATING PHASE ───

  // Auto-generate mode: skip the form entirely
  if (autoGenerate && (appState === "setup" || appState === "generating")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        {appState === "generating" ? (
          <>
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Generating your test...
            </h2>
            <p className="text-slate-400 text-sm">
              Creating {autoGenerate.numQuestions} questions on{" "}
              <span className="text-indigo-400 font-bold">
                {autoGenerate.subject}
              </span>{" "}
              for {autoGenerate.examName}
            </p>
          </>
        ) : error ? (
          <>
            <p className="text-6xl mb-4">❌</p>
            <h2 className="text-xl font-bold text-white mb-2">
              Generation Failed
            </h2>
            <p className="text-rose-400 text-sm mb-6 max-w-md">{error}</p>
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors"
              >
                ← Back to Dashboard
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Preparing...
            </h2>
          </>
        )}
      </div>
    );
  }

  if (appState === "setup" || appState === "generating") {
    return (
      <div className="max-w-5xl mx-auto my-12 p-8 sm:p-12 bg-white/80 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-white/50 dark:border-slate-700/50 transition-all min-h-[500px] relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-5xl mb-4">
            AI Question Paper Generator
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Configure your parameters below to generate a live, AI-powered test.
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
        >
          {/* Target Exam */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Target Exam
            </label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="JEE">JEE (Mains + Advanced)</option>
              <option value="NEET">NEET</option>
              <option value="CUET">CUET</option>
              <option value="GATE">GATE</option>
            </select>
          </div>

          {/* Generation Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Generation Type
            </label>
            <select
              value={generationType}
              onChange={(e) => setGenerationType(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="Topic Wise">Topic Wise</option>
              <option value="Subject Wise">Subject Wise</option>
              <option value="Complete Paper">
                🎯 Full Mock Test (All Subjects)
              </option>
            </select>
          </div>

          {/* Subject/Topic */}
          {generationType !== "Complete Paper" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {generationType === "Subject Wise"
                  ? "Select Subject"
                  : "Subject / Topic Focus"}
              </label>
              {generationType === "Subject Wise" && examName === "JEE" ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              ) : generationType === "Subject Wise" && examName === "NEET" ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Thermodynamics, Kinematics..."
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              )}
            </div>
          )}

          {/* Difficulty & Num Questions */}
          <div className="space-y-2 flex gap-4">
            <div
              className={`${generationType === "Complete Paper" ? "w-full" : "flex-1"}`}
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="easier">Easier</option>
                <option value="actual experience as in actual paper">
                  Actual Difficulty
                </option>
                <option value="harder than an actual ques paper">Harder</option>
              </select>
            </div>
            {generationType !== "Complete Paper" && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* Complete Paper Info */}
          {generationType === "Complete Paper" && (
            <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
              <p className="text-base font-bold text-indigo-700 dark:text-indigo-300 mb-3">
                🎯 Full Mock Test — {examName}
              </p>
              {examName === "JEE" && (
                <div className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <p className="font-semibold">
                    75 Questions • 3 Hours • Physics + Chemistry + Mathematics
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        25
                      </p>
                      <p className="text-xs text-slate-500">Physics</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        25
                      </p>
                      <p className="text-xs text-slate-500">Chemistry</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        25
                      </p>
                      <p className="text-xs text-slate-500">Mathematics</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                    ⚠ Marking: +4 correct, −1 incorrect. Free AI models may
                    struggle with 75 questions.
                  </p>
                </div>
              )}
              {examName === "NEET" && (
                <div className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <p className="font-semibold">
                    200 Questions • 3 hrs 20 min • Physics + Chemistry + Biology
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        50
                      </p>
                      <p className="text-xs text-slate-500">Physics</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        50
                      </p>
                      <p className="text-xs text-slate-500">Chemistry</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-900">
                      <p className="font-black text-lg text-indigo-700 dark:text-indigo-300">
                        100
                      </p>
                      <p className="text-xs text-slate-500">Biology</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                    ⚠ Marking: +4 correct, −1 incorrect. Free AI models may
                    struggle with 200 questions.
                  </p>
                </div>
              )}
              {examName === "CUET" && (
                <div className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <p className="font-semibold">
                    50 Questions • 1 Hour • Complete Syllabus
                  </p>
                  <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                    ⚠ Marking: +5 correct, −1 incorrect.
                  </p>
                </div>
              )}
              {examName === "GATE" && (
                <div className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <p className="font-semibold">
                    65 Questions • 3 Hours • Complete Syllabus
                  </p>
                  <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                    ⚠ Marking: +1 correct, −0.33 incorrect.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="md:col-span-2 mt-8">
            {generationType === "Complete Paper" ? (
              <div>
                <button
                  type="button"
                  disabled
                  className="w-full py-5 px-8 rounded-2xl bg-slate-400 text-white text-xl font-black shadow-xl cursor-not-allowed opacity-70"
                >
                  🚫 Full Mock Test Unavailable
                </button>
                <div className="mt-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700">
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-1">
                    ⚠️ No Free Model Available
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    As of now, we have not found any free AI model capable of
                    generating this many questions in a single request. The
                    output gets truncated midway, resulting in broken JSON.
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-semibold">
                    💡 Please use <strong>&quot;Topic Wise&quot;</strong> or{" "}
                    <strong>&quot;Subject Wise&quot;</strong> mode to generate
                    smaller tests (up to 50 questions) for now.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={appState === "generating"}
                className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right text-white text-xl font-black shadow-xl shadow-indigo-500/30 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                {appState === "generating" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Generating Questions via AI...
                  </span>
                ) : (
                  "Generate Live Test"
                )}
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="p-5 mb-8 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 font-medium">
            <strong className="font-bold block mb-1">Retrieval Failed</strong>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── READY PHASE ───
  if (appState === "ready") {
    return (
      <div className="max-w-3xl mx-auto my-20">
        <div className="flex flex-col items-center justify-center py-10 px-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
            {questions.length} Questions Ready!
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-2 text-center">
            {examName} — {generationType}
          </p>
          <p className="text-slate-400 dark:text-slate-500 mb-8 max-w-sm text-center text-sm">
            The test will open in fullscreen CBT mode. Switching tabs or exiting
            fullscreen will auto-submit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={resetGenerator}
              className="py-4 px-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold transition-all w-full sm:w-auto"
            >
              Cancel
            </button>
            <Link href={`/test/${questionLink}`}>
              <button
                // onClick={startTest}
                className="py-4 px-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                Attempt Test Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── TESTING PHASE (CBT UI) ───
  if (appState === "testing") {
    const q = questions[currentQ];
    return (
      <section className="h-screen flex flex-col bg-white dark:bg-slate-900">
        {/* ── Header with Timer ── */}
        <Navbar
          isBordered
          className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
        >
          <NavbarContent justify="start">
            <NavbarItem>
              <h1 className="font-bold text-lg text-slate-800 dark:text-white">
                {examName} — Question {currentQ + 1} of {questions.length}
              </h1>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <Chip
              startContent={<TimerIcon weight="bold" />}
              className={`pl-2 font-mono font-bold text-lg ${timeLeft !== null && timeLeft <= 60 ? "bg-red-100 text-red-600 animate-pulse" : "bg-indigo-100 text-indigo-700"}`}
            >
              {formatTime(timeLeft)}
            </Chip>
          </NavbarContent>
        </Navbar>

        {/* ── Main Content Area ── */}
        <section className="flex-1 h-full flex flex-col-reverse md:flex-row overflow-y-auto">
          {/* Question Content */}
          <div className="overflow-auto h-full w-full p-6 md:p-10 flex flex-col space-y-6 bg-white dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Question {currentQ + 1}
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {q?.question}
            </p>

            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-4">
              Select your answer:
            </h3>

            <RadioGroup
              value={userAnswers[currentQ] || ""}
              onValueChange={handleSelectOption}
              className="mt-2 space-y-3"
            >
              {q?.options?.map((opt: string, optIdx: number) => (
                <Radio
                  key={optIdx}
                  value={opt}
                  classNames={{
                    base: `max-w-full px-5 py-4 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-400 ${userAnswers[currentQ] === opt ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"}`,
                    label: `text-base font-medium ${userAnswers[currentQ] === opt ? "text-indigo-800 dark:text-indigo-200" : "text-slate-700 dark:text-slate-300"}`,
                  }}
                >
                  <span className="font-bold mr-3 text-slate-400">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  {opt}
                </Radio>
              ))}
            </RadioGroup>
          </div>

          {/* Sidebar with Question Grid + Legend */}
          <div className="bg-amber-50 dark:bg-slate-800 p-3 flex md:flex-col gap-4 md:w-72 border-l border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex gap-1 flex-nowrap md:flex-wrap overflow-x-auto">
              {questions.map((_, idx) => (
                <QuestionButton
                  key={idx}
                  isActive={idx === currentQ}
                  label={idx + 1}
                  questionStatus={getQuestionStatus(idx)}
                  onPress={() => goToQuestion(idx)}
                />
              ))}
            </div>
            <div className="ml-auto md:ml-0">
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button size="lg" isIconOnly className="md:hidden">
                    <InfoIcon size={24} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2 space-y-2">
                    <div className="flex gap-2 items-center">
                      <QuestionButton
                        label={1}
                        questionStatus={QuestionStatus.NotVisited}
                      />
                      <p className="text-sm">Not Visited</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <QuestionButton
                        label={2}
                        questionStatus={QuestionStatus.NotAnswered}
                      />
                      <p className="text-sm">Visited (No Answer)</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <QuestionButton
                        label={3}
                        questionStatus={QuestionStatus.Answered}
                      />
                      <p className="text-sm">Answered</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <QuestionButton
                        label={4}
                        questionStatus={QuestionStatus.Marked}
                      />
                      <p className="text-sm">Marked for Review</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <QuestionButton
                        label={5}
                        questionStatus={QuestionStatus.AnsweredMarked}
                      />
                      <p className="text-sm">Answered &amp; Marked</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="hidden md:flex flex-col gap-2 mt-4">
                <div className="flex gap-2 items-center">
                  <QuestionButton
                    label={1}
                    questionStatus={QuestionStatus.NotVisited}
                  />
                  <p className="text-sm">Not Visited</p>
                </div>
                <div className="flex gap-2 items-center">
                  <QuestionButton
                    label={2}
                    questionStatus={QuestionStatus.NotAnswered}
                  />
                  <p className="text-sm">Visited</p>
                </div>
                <div className="flex gap-2 items-center">
                  <QuestionButton
                    label={3}
                    questionStatus={QuestionStatus.Answered}
                  />
                  <p className="text-sm">Answered</p>
                </div>
                <div className="flex gap-2 items-center">
                  <QuestionButton
                    label={4}
                    questionStatus={QuestionStatus.Marked}
                  />
                  <p className="text-sm">Marked</p>
                </div>
                <div className="flex gap-2 items-center">
                  <QuestionButton
                    label={5}
                    questionStatus={QuestionStatus.AnsweredMarked}
                  />
                  <p className="text-sm">Answered &amp; Marked</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer with Actions ── */}
        <div className="bg-slate-100 dark:bg-slate-800 flex flex-col md:flex-row gap-3 p-4 pb-6 w-full border-t-2 border-slate-200 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex gap-3 w-full">
            <Button
              className="flex-1 md:flex-initial md:w-32 h-11 text-base font-bold"
              color="danger"
              variant="flat"
              onPress={handleClear}
            >
              Clear
            </Button>
            <Button
              className="flex-1 md:flex-initial md:w-40 h-11 text-base font-bold"
              color="secondary"
              variant="flat"
              onPress={handleMarkAndNext}
            >
              Mark &amp; Next
            </Button>
            <Button
              className="flex-1 md:flex-initial md:w-32 md:ml-auto h-11 text-base font-bold"
              color="success"
              variant="flat"
              onPress={handleSaveAndNext}
            >
              Save &amp; Next
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 h-11 text-base font-bold"
              color="primary"
              variant="solid"
              onPress={submitTest}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ─── RESULTS PHASE ───
  if (appState === "results") {
    return (
      <div className="max-w-5xl mx-auto my-12 p-8 space-y-16">
        <div className="bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950/30 p-12 sm:p-16 rounded-[3.5rem] text-center border border-white/60 dark:border-slate-700/50 shadow-2xl shadow-indigo-500/10 relative overflow-hidden backdrop-blur-2xl">
          <h3 className="text-2xl text-slate-500 dark:text-slate-400 font-bold mb-4 uppercase tracking-widest">
            Test Completed
          </h3>
          <div className="text-8xl font-black text-slate-800 dark:text-white mb-6">
            <span
              className={
                scoreData.marks >= 0
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-rose-500"
              }
            >
              {scoreData.marks}
            </span>
            <span className="text-4xl text-slate-400 font-bold ml-2">
              / {scoreData.maxMarks}
            </span>
          </div>
          <p className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-6">
            Total Marks Scored
          </p>
          <div className="flex justify-center gap-6 mb-10 text-lg flex-wrap">
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-bold">
              Correct: {scoreData.correct} (+
              {parseFloat(
                (scoreData.correct * scoreData.correctMark).toFixed(2),
              )}
              )
            </div>
            <div className="bg-rose-100 text-rose-800 px-4 py-2 rounded-xl font-bold">
              Incorrect: {scoreData.incorrect} (-
              {parseFloat(
                (scoreData.incorrect * scoreData.incorrectMark).toFixed(2),
              )}
              )
            </div>
            <div className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold">
              Unattempted: {scoreData.unattempted} (0)
            </div>
          </div>
          <button
            onClick={resetGenerator}
            className="py-4 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
          >
            Generate A New Test
          </button>
        </div>

        {/* Detailed Review */}
        <div className="space-y-8">
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-4 pl-2">
            Detailed Answer Review
          </h3>
          {questions.map((q, idx) => {
            const uAns = userAnswers[idx] || "";
            const cAns = q.correctAnswer || "";
            const isCorrect = uAns && uAns === cAns;
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl border-2 shadow-sm transition-all ${isCorrect ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"}`}
              >
                <p className="text-xl font-semibold text-slate-900 dark:text-white mb-6 leading-relaxed flex items-start">
                  <span
                    className={`mr-4 border rounded-full px-4 py-1 text-sm font-black flex-shrink-0 mt-1 shadow-sm ${isCorrect ? "text-emerald-700 bg-emerald-100 border-emerald-300" : "text-rose-700 bg-rose-100 border-rose-300"}`}
                  >
                    Q{idx + 1}
                  </span>
                  {q.question}
                </p>
                <div className="grid grid-cols-1 gap-3 ml-2 sm:ml-12 mb-6">
                  {q.options?.map((opt: string, optIdx: number) => {
                    const isSelected = uAns === opt;
                    const isActualCorrect = cAns === opt;
                    let optStyle = "border-slate-100 bg-white text-slate-600";
                    if (isActualCorrect)
                      optStyle =
                        "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-sm";
                    else if (isSelected && !isCorrect)
                      optStyle =
                        "border-rose-400 bg-rose-50 text-rose-800 opacity-90 line-through decoration-rose-400/50";
                    return (
                      <div
                        key={optIdx}
                        className={`px-5 py-4 rounded-xl border-2 transition-all ${optStyle}`}
                      >
                        <span className="font-bold text-sm mr-4 tracking-wide opacity-50">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                        {isActualCorrect && isSelected && (
                          <span className="float-right text-emerald-500 font-extrabold pr-2">
                            ✓
                          </span>
                        )}
                        {!isCorrect && isSelected && (
                          <span className="float-right text-rose-500 font-extrabold pr-2">
                            ✗
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!isCorrect && (
                  <div className="ml-2 sm:ml-12 mt-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-12">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Your Answer
                      </p>
                      <p className="text-base font-bold text-rose-600">
                        {uAns || "Skipped"}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px bg-slate-200"></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Correct Answer
                      </p>
                      <p className="text-base font-bold text-emerald-600">
                        {cAns}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
