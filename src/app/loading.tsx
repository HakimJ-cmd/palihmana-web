import React from "react";

export default function RootLoading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Top Breadcrumb & Title skeleton */}
      <div className="h-4 w-32 bg-line/60 rounded mb-4" />
      <div className="h-8 w-2/3 max-w-lg bg-line/80 rounded mb-3" />
      <div className="h-4 w-1/2 max-w-sm bg-line/50 rounded mb-8" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="w-full aspect-[16/9] bg-line/40 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-line/50 rounded" />
            <div className="h-4 w-5/6 bg-line/50 rounded" />
            <div className="h-4 w-4/6 bg-line/50 rounded" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="h-6 w-36 bg-line/60 rounded mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg border border-line/40">
              <div className="w-20 h-20 bg-line/40 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3.5 w-full bg-line/60 rounded" />
                <div className="h-3 w-3/4 bg-line/40 rounded" />
                <div className="h-2.5 w-1/3 bg-line/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
