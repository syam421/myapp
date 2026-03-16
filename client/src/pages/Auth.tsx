import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { z } from "zod";
import { Cloud, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister } from "@/hooks/use-auth";

export function AuthPage() {
  const [location] = useLocation();
  const isLogin = location === "/login";

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/50 to-primary/30 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] opacity-10 mix-blend-overlay object-cover" />
        <div className="relative z-10 max-w-lg px-12 text-primary-foreground">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-primary-foreground mb-8 shadow-xl border border-white/30">
            <Cloud className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6 font-display">A beautiful home for your work.</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Join thousands of creatives and professionals who trust Lumina to store, organize, and share their most important files.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
          <Cloud className="w-5 h-5" />
          <span>Lumina</span>
        </Link>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {isLogin 
                    ? "Enter your details to access your files." 
                    : "Start your free storage journey today."}
                </p>
              </div>

              {isLogin ? <LoginForm /> : <RegisterForm />}

              <div className="mt-8 text-center text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link href={isLogin ? "/register" : "/login"} className="text-foreground font-semibold hover:underline decoration-primary underline-offset-4">
                  {isLogin ? "Sign up" : "Log in"}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const form = useForm<z.infer<typeof api.auth.login.input>>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof api.auth.login.input>) => {
    login(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email" 
          type="email" 
          {...form.register("email")} 
          className="h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/50" 
          placeholder="name@example.com" 
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Forgot password?</a>
        </div>
        <Input 
          id="password" 
          type="password" 
          {...form.register("password")} 
          className="h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/50" 
          placeholder="••••••••" 
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isPending} 
        className="w-full h-12 rounded-xl text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4 group"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            Log in
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}

function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const form = useForm<z.infer<typeof api.auth.register.input>>({
    resolver: zodResolver(api.auth.register.input),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof api.auth.register.input>) => {
    register(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input 
          id="name" 
          {...form.register("name")} 
          className="h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/50" 
          placeholder="John Doe" 
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email" 
          type="email" 
          {...form.register("email")} 
          className="h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/50" 
          placeholder="name@example.com" 
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          {...form.register("password")} 
          className="h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/50" 
          placeholder="At least 6 characters" 
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isPending} 
        className="w-full h-12 rounded-xl text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4 group"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            Create account
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
