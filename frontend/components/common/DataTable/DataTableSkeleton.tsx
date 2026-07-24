"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
  columns?: number;
}

export default function DataTableSkeleton({ rows = 6, columns = 7 }: Props) {
  return (
    <div className="p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid gap-4 py-3"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((__, j) => (
            <Skeleton key={j} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}
