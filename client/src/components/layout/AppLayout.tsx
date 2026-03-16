import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { useUser } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 flex items-center px-6 gap-4 bg-card sticky top-0 z-10">
          <div className="font-bold text-lg flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">C</div>
            CloudNest
          </div>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-testid="input-search"
                type="search"
                placeholder="Search files by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-full border-border/60 bg-background focus-visible:ring-primary/30"
              />
            </div>
          </form>
          <div className="text-sm text-muted-foreground hidden md:block">
            Hi, <span className="font-semibold text-foreground">{user.name}</span>
          </div>
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
