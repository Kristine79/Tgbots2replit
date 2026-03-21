import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink, Star, CheckCircle, ShieldAlert, Users, Sparkles, MessageSquare, Share2, Info, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useGetBot } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { GlassCard } from "@/components/ui/glass-card";

export default function BotDetail() {
  const [, params] = useRoute("/bot/:id");
  const botId = params?.id ? parseInt(params.id) : 0;
  
  const { data: bot, isLoading, error } = useGetBot(botId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-white/5 rounded-lg mb-8" />
          <div className="h-64 glass-panel rounded-3xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 glass-panel rounded-3xl" />
            <div className="h-64 glass-panel rounded-3xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !bot) {
    return (
      <Layout>
        <div className="py-20 text-center flex flex-col items-center">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Bot not found</h2>
          <p className="text-muted-foreground mb-6">The bot you are looking for does not exist or has been removed.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            Return Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to directory</span>
          </Link>
        </motion.div>

        {/* Hero Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Big Glow Behind Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none z-0" />
          
          <GlassCard className="p-6 sm:p-10 mb-8 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-7xl shadow-2xl relative">
              {bot.iconEmoji}
              {bot.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-primary fill-primary/20" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 justify-center sm:justify-start">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  {bot.name}
                </h1>
                {bot.isPremium && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold mx-auto sm:mx-0 w-fit">
                    <Sparkles className="w-4 h-4" />
                    Premium
                  </span>
                )}
              </div>
              
              <p className="text-xl text-primary font-medium mb-6">@{bot.username}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white text-base leading-none mb-1">{bot.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs">{formatNumber(bot.reviewCount)} reviews</span>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white text-base leading-none mb-1">{formatNumber(bot.monthlyUsers)}</span>
                    <span className="text-muted-foreground text-xs">monthly users</span>
                  </div>
                </div>

                <div className="w-px h-8 bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white text-base leading-none mb-1 capitalize">{bot.category}</span>
                    <span className="text-muted-foreground text-xs">category</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-auto flex flex-col gap-3 shrink-0">
              <button 
                onClick={() => window.open(bot.telegramUrl, '_blank')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,158,217,0.4)] hover:shadow-[0_0_30px_rgba(34,158,217,0.6)] flex items-center justify-center gap-2"
              >
                Open in Telegram
                <ExternalLink className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel glass-panel-hover text-white font-medium flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                Share Bot
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                About this Bot
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                  {bot.description}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Reviews
              </h2>
              <div className="space-y-6">
                {/* Mocked reviews for UI completeness since API doesn't provide them */}
                {[1, 2].map((i) => (
                  <div key={i} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-white">Alex User {i}</p>
                        <div className="flex items-center text-amber-400">
                          {Array(5).fill(0).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Absolutely brilliant bot. Does exactly what it promises and is incredibly fast. The premium features are definitely worth it if you use this daily!
                    </p>
                  </div>
                ))}
                <button className="w-full py-3 rounded-xl border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors">
                  Show All Reviews
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <GlassCard className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {bot.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-b from-primary/10 to-transparent border-t-primary/30">
              <h3 className="font-display font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tip
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Did you know you can add this bot directly to your groups to unlock multiplayer features?
              </p>
              <button 
                onClick={() => window.open(`${bot.telegramUrl}?startgroup=true`, '_blank')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
              >
                Add to Group
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
