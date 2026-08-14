"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { agentApi, coreApi, type HealthResponse } from "@/lib/api";

type LoadState = "idle" | "loading" | "ok" | "error";

export function HealthCard() {
  const [state, setState] = useState<LoadState>("idle");
  const [health, setHealth] = useState<{ core: HealthResponse; agent: HealthResponse } | null>(null);

  const loadHealth = useCallback(async (showAlert: boolean) => {
    setState("loading");
    try {
      const [core, agent] = await Promise.all([
        coreApi.get<HealthResponse>("health/"),
        agentApi.get<HealthResponse>("health/"),
      ]);
      setHealth({ core: core.data, agent: agent.data });
      setState("ok");
    } catch {
      setHealth(null);
      setState("error");
      if (showAlert) {
        await Swal.fire({
          title: "Backend connection failed",
          text: "Could not reach both /core/health/ and /agent/health/.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  }, []);

  useEffect(() => {
    void loadHealth(false);
  }, [loadHealth]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Backend connection status</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Core + Agent</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${state === "ok" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : state === "error" ? "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300" : "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}>
          {state === "ok" ? "Connected" : state === "error" ? "Disconnected" : "Checking"}
        </span>
      </div>

      <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
        {health ? JSON.stringify(health, null, 2) : state === "error" ? "Backend health responses unavailable." : "Checking Django and FastAPI health endpoints..."}
      </pre>

      <button
        type="button"
        onClick={() => void loadHealth(true)}
        className="mt-5 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Retry backend check
      </button>
    </section>
  );
}
