import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Cloud, LayoutDashboard, FolderOpen, Heart, 
  Settings, LogOut, Upload, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";
import { useState } from "react";
import { UploadModal } from "@/components/UploadModal";
import { CreateFolderModal } from "@/components/CreateFolderModal";

export function Sidebar() {
  const [location] = useLocation();
  const { mutate: logout } = useLogout();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "All Files", path: "/files", icon: FolderOpen },
    { name: "Favorites", path: "/favorites", icon: Heart },
  ];

  return (
    <>
      <div className="w-64 h-screen hidden md:flex flex-col bg-card border-r border-border/50 sticky top-0 z-10 shadow-soft">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Lumina</span>
        </div>

        <div className="px-4 pb-6 space-y-3">
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 flex items-center gap-2 justify-start py-6"
          >
            <Upload className="w-5 h-5" />
            <span className="font-semibold text-base">Upload File</span>
          </Button>
          
          <Button 
            onClick={() => setIsFolderOpen(true)}
            variant="outline"
            className="w-full rounded-xl border-dashed border-2 flex items-center gap-2 justify-start py-6 hover:bg-accent/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-base">New Folder</span>
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path || location.startsWith(`${item.path}/`);
            return (
              <Link key={item.path} href={item.path} className="block">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-accent/40 text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active" 
                      className="absolute left-0 w-1.5 h-8 bg-primary rounded-r-full" 
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            onClick={() => logout()}
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <CreateFolderModal isOpen={isFolderOpen} onClose={() => setIsFolderOpen(false)} />
    </>
  );
}
