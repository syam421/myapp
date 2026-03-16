import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Cloud, Shield, Zap, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-auth";

export function Landing() {
  const { data: user } = useUser();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary selection:text-primary-foreground">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Lumina</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors">Features</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors">Pricing</span>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/register">
            <Button className="rounded-xl px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-foreground border border-primary/20 font-medium text-sm">
              <Zap className="w-4 h-4" />
              Next Generation Cloud Storage
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Store beautifully.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground to-amber-500">
                Access instantly.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Lumina provides a serene, blazing-fast workspace for all your digital files. Your personal cloud, reimagined.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="rounded-xl px-8 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-border/50 glass-card">
              {/* landing page hero abstract geometric art representing files and folders */}
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="Abstract Storage Representation" 
                className="w-full h-auto object-cover aspect-video mix-blend-overlay opacity-60"
              />
              
              {/* Mock UI Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col">
                <div className="w-full h-12 rounded-xl bg-background/80 backdrop-blur-md mb-6 flex items-center px-4 gap-3 shadow-sm border border-white/20">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="w-48 h-6 bg-muted rounded mx-auto" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 flex flex-col justify-center items-center gap-4">
                    <HardDrive className="w-12 h-12 text-primary" />
                    <div className="w-24 h-4 bg-muted rounded" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 flex flex-col justify-center items-center gap-4">
                    <Shield className="w-12 h-12 text-primary" />
                    <div className="w-24 h-4 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-foreground">Secure by default</p>
                <p className="text-sm text-muted-foreground">End-to-end encryption</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
