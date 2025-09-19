"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-3 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 w-64 mx-auto" />
          <Skeleton className="h-4 sm:h-5 w-80 mx-auto" />
        </div>

        <div className="grid gap-6 sm:gap-8 xl:grid-cols-2">
          {/* Profile Info Card Skeleton */}
          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
            <CardHeader className="space-y-2 p-4 sm:p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card Skeleton */}
          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
            <CardHeader className="space-y-2 p-4 sm:p-6">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-4"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
              <Skeleton className="h-6 w-32" />
              <ul className="space-y-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-40" />
                ))}
              </ul>
              <Skeleton className="h-10 w-40 mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
