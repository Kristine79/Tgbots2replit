import { ReactNode } from "react";
import { Link } from "wouter";
import { Bot } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div 
        className="fixed inset-0 z-[-1] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass-panel border-x-0 border-t-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/80 to-primary flex items-center justify-center shadow-[0_0_15px_rgba(34,158,217,0.4)] group-hover:shadow-[0_0_25px_rgba(34,158,217,0.6)] transition-all duration-300">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-glow transition-all">
              TG Боты
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 mt-auto glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 Лучшие Telegram Боты. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
