"use client";

import { ReactNode } from "react";
import Link from "next/link";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div 
        className="fixed inset-0 z-[-1] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url(/images/hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <main className="flex-1 pt-4 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="py-6 border-t border-white/10 mt-auto glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 Полезные Боты. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
