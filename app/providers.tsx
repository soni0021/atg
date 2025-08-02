'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("@/components/ui/toaster").then((mod) => ({ default: mod.Toaster })), { ssr: false });
const Sonner = dynamic(() => import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster })), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        forcedTheme="light"
      >
        {children}
        <Toaster />
        <Sonner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}