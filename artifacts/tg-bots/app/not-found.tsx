"use client";

import Link from "next/link";
import { Layout } from "@/components/layout";
import { SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
          <SearchX className="w-12 h-12 text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">404 - Lost in the Matrix</h1>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          The page or bot you are looking for seems to have vanished into the digital void.
        </p>
        <Link href="/" className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(34,158,217,0.4)]">
          Return to Dashboard
        </Link>
      </motion.div>
    </Layout>
  );
}
