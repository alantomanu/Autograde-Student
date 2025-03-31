"use client";

import { cn } from "@/lib/utils";
import { GridPattern } from "./magicui/grid-pattern";

interface BackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen bg-gray-50/80">
      <div className="fixed inset-0 w-full h-full z-0">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-0 w-full h-full",
            "opacity-50",
            "stroke-gray-300"
          )}
          style={{
            strokeWidth: 1.5,
          }}
        />
      </div>
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
}
