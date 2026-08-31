import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col overflow-hidden animate-pulse">
      {/* Media Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-slate-200 dark:bg-slate-800" />

      {/* Info Body Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center gap-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/5" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-10" />
          </div>

          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/5" />

          <div className="flex gap-1.5 pt-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-14" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
          </div>

          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 pt-1" />
        </div>

        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      </div>
    </div>
  );
}
