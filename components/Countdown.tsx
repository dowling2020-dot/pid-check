"use client";

import { useEffect, useState } from "react";
import { PID_DEADLINE_ISO } from "@/lib/site";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function computeParts(target: number): Parts {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    passed: false,
  };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[68px] flex-col items-center rounded-lg bg-white/10 px-3 py-2">
      <span className="text-2xl font-bold tabular-nums sm:text-3xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-white/70">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const target = new Date(PID_DEADLINE_ISO).getTime();
  // Start null so server and first client render match; hydrate on mount.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(computeParts(target));
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (parts?.passed) {
    return (
      <p className="text-sm font-medium text-white/90">
        The 1&nbsp;November&nbsp;2026 PID deadline has passed. Declarations without valid PIDs are
        being rejected at submission.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-white/70">
        Time until PIDs are mandatory (1 November 2026)
      </p>
      <div className="flex gap-2" aria-live="polite">
        {parts ? (
          <>
            <Cell value={parts.days} label="days" />
            <Cell value={parts.hours} label="hrs" />
            <Cell value={parts.minutes} label="min" />
            <Cell value={parts.seconds} label="sec" />
          </>
        ) : (
          <>
            <Cell value={0} label="days" />
            <Cell value={0} label="hrs" />
            <Cell value={0} label="min" />
            <Cell value={0} label="sec" />
          </>
        )}
      </div>
    </div>
  );
}
