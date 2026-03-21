import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Bot, Search, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract background image */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/80 to-primary flex items-center justify-center shadow-[0_0_15px_rgba(34,158,217,0.4)] group-hover:shadow-[0_0_25px_rgba(34,158,217,0.6)] transition-all duration-300">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-glow transition-all">
              TG Боты
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary text-glow' : 'text-muted-foreground'}`}>
              Каталог
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-not-allowed opacity-70">
              Категории
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-not-allowed opacity-70">
              Добавить бота
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="h-10 px-4 rounded-xl glass-panel glass-panel-hover flex items-center gap-2 text-sm font-medium text-white">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Премиум</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg glass-panel glass-panel-hover"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 glass-panel border-x-0 border-t-0 p-4 md:hidden flex flex-col gap-4"
          >
            <Link href="/" className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Каталог
            </Link>
            <div className="px-4 py-3 rounded-xl opacity-50 cursor-not-allowed">
              Категории (скоро)
            </div>
            <div className="px-4 py-3 rounded-xl opacity-50 cursor-not-allowed">
              Добавить бота (скоро)
            </div>
            <div className="h-px w-full bg-white/10 my-2" />
            <button className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4" />
              Получить Премиум
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 mt-auto glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Лучшие Telegram Боты. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-primary transition-colors">Условия</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
