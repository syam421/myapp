import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useUser } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 flex items-center px-6 md:hidden justify-between bg-card">
          <div className="font-bold text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">L</div>
            Lumina
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
