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
            // Left side (reduced)
            [5, 8],
            [5, 14],
            [5, 20],
            
            // Left-center
            [12, 6],
            [12, 12],
            [12, 18],
            [12, 24],
            
            // Center-right
            [19, 8],
            [19, 14],
            [19, 20],
            
            // Right side (reduced)
            [26, 10],
            [26, 16],
            [26, 22],
          ]}
          className={cn(
            "[mask-image:radial-gradient(1600px_circle_at_center,white,transparent)]",
            "absolute inset-0 w-full h-full",
            "opacity-35",
            "stroke-gray-300",
            
          )}
          style={{
            strokeWidth: 1.25,
          }}
        />
      </div>
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
}
