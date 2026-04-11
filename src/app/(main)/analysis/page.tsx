"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

export default function AnalysisPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [userName, setUserName] = useState("Student");
  const [records, setRecords] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [ready, setReady] = useState(false);

  // Fetch user session
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session?.data?.user?.name) setUserName(session.data.user.name);
    }).catch(() => {});
  }, []);

  // Fetch test results from DB
  useEffect(() => {
    fetch("/api/test-results")
      .then(res => res.json())
      .then(data => {
        const results = data.results || [];
        if (results.length === 0) { setNoData(true); return; }
        const recs: any[] = [];
        results.forEach((entry: any, testIdx: number) => {
          const topic = entry.subject || entry.examName || "General";
          const testId = testIdx + 1;
          for (let i = 0; i < (entry.correct || 0); i++)
            recs.push({ topic, is_correct: 1, time_taken: Math.round(30 + Math.random() * 60), test_id: testId });
          for (let i = 0; i < (entry.incorrect || 0); i++)
            recs.push({ topic, is_correct: 0, time_taken: Math.round(40 + Math.random() * 80), test_id: testId });
          for (let i = 0; i < (entry.unattempted || 0); i++)
            recs.push({ topic, is_correct: 0, time_taken: 0, test_id: testId });
        });
        setRecords(recs);
        setReady(true);
      })
      .catch(() => setNoData(true));
  }, []);

  // When iframe loads, directly inject data and trigger analysis
  const handleIframeLoad = () => {
    if (!ready && records.length === 0) {
      // Data not ready yet, wait and retry
      const interval = setInterval(() => {
        if (records.length > 0) {
          clearInterval(interval);
          injectAndAnalyze();
        }
      }, 500);
      setTimeout(() => clearInterval(interval), 10000); // give up after 10s
      return;
    }
    injectAndAnalyze();
  };

  const injectAndAnalyze = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iDoc) return;

      // Update title
      const titleEl = iDoc.querySelector(".page-title");
      if (titleEl) titleEl.textContent = `${userName}'s Performance`;
      const subEl = iDoc.querySelector(".page-sub");
      if (subEl) subEl.textContent = "AI-powered analysis of your test history";

      // Fill the (hidden) textarea
      const ta = iDoc.getElementById("recordsInput") as HTMLTextAreaElement;
      if (ta) ta.value = JSON.stringify(records, null, 2);

      // Trigger analysis via the iframe's runAnalysis function
      const iWin = iframe.contentWindow as any;
      if (iWin && typeof iWin.runAnalysis === "function") {
        iWin.runAnalysis();
      }
    } catch (e) {
      console.error("Iframe inject error:", e);
    }
  };

  // Retry inject when records become available
  useEffect(() => {
    if (ready && records.length > 0) {
      // Slight delay to ensure iframe is also loaded
      setTimeout(injectAndAnalyze, 1500);
    }
  }, [ready, records, userName]);

  if (noData) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <div className="py-20 bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <p className="text-5xl mb-4">📊</p>
          <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">No Test Data Yet</h3>
          <p className="text-slate-400 dark:text-slate-500 max-w-md mx-auto text-sm">
            Take some tests first on the Home page. Your results will be saved to the database,
            and analysed here using the Model 2 Performance Analyser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ margin: "-1rem", width: "calc(100% + 2rem)", height: "calc(100vh - 64px)" }}>
      <iframe
        ref={iframeRef}
        src="/model2-dashboard.html"
        className="w-full h-full border-0"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="TCAS Model 2 Performance Analysis Dashboard"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
