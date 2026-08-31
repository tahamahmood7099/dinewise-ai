import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse flex flex-col gap-3">
      <div className="w-full pt-[85%] bg-slate-200 dark:bg-slate-700 rounded-xl" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
      </div>
    </div>
  );
}
