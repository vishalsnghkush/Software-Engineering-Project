"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import { Trash, ClockCounterClockwise, Trophy, Target, XCircle, MinusCircle } from "@phosphor-icons/react";

interface HistoryEntry {
  id: number;
  examName: string;
  generationType: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  marks: number;
  maxMarks: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  createdAt: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-results");
      const data = await res.json();
      setHistory(data.results || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const deleteEntry = async (id: number) => {
    try {
      await fetch(`/api/test-results?id=${id}`, { method: "DELETE" });
      setHistory(h => h.filter(e => e.id !== id));
    } catch {}
  };

  const clearAll = async () => {
    try {
      await fetch("/api/test-results?all=true", { method: "DELETE" });
      setHistory([]);
    } catch {}
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return "text-emerald-500";
    if (acc >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const getAccuracyBg = (acc: number) => {
    if (acc >= 80) return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800";
    if (acc >= 50) return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800";
    return "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClockCounterClockwise size={32} weight="duotone" className="text-indigo-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Test History</h1>
            <p className="text-slate-500 text-sm mt-1">{history.length} test{history.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>
        {history.length > 0 && (
          <Button color="danger" variant="flat" size="sm" startContent={<Trash size={16} />} onPress={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-24 text-slate-500">Loading history from database...</div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <ClockCounterClockwise size={56} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">No Tests Yet</h3>
          <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto text-sm">
            Go to the Home page, generate a test, and submit it. Your results will be saved to the database automatically.
          </p>
        </div>
      )}

      {/* History Cards */}
      <div className="space-y-4">
        {history.map((entry) => (
          <Card key={entry.id} shadow="sm" className={`border ${getAccuracyBg(entry.accuracy)} transition-all hover:shadow-md`}>
            <CardBody className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Accuracy Circle */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${entry.accuracy >= 80 ? 'border-emerald-400' : entry.accuracy >= 50 ? 'border-amber-400' : 'border-rose-400'}`}>
                    <span className={`text-2xl font-black ${getAccuracyColor(entry.accuracy)}`}>{entry.accuracy}%</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Chip size="sm" color="primary" variant="flat" className="font-bold">{entry.examName}</Chip>
                    <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{entry.generationType}</Chip>
                    <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{entry.subject}</Chip>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(entry.createdAt)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Difficulty: {entry.difficulty}</p>
                </div>

                {/* Score Stats */}
                <div className="flex gap-4 items-center flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Trophy size={16} weight="fill" />
                      <span className="text-lg font-black">{entry.marks}</span>
                    </div>
                    <p className="text-xs text-slate-400">/ {entry.maxMarks}</p>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex gap-3 text-center">
                    <div>
                      <div className="flex items-center gap-1 text-emerald-500"><Target size={14} /><span className="font-bold text-sm">{entry.correct}</span></div>
                      <p className="text-[10px] text-slate-400 uppercase">Correct</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-rose-500"><XCircle size={14} /><span className="font-bold text-sm">{entry.incorrect}</span></div>
                      <p className="text-[10px] text-slate-400 uppercase">Wrong</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-400"><MinusCircle size={14} /><span className="font-bold text-sm">{entry.unattempted}</span></div>
                      <p className="text-[10px] text-slate-400 uppercase">Skip</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => deleteEntry(entry.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
