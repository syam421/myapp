import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Cloud, LayoutDashboard, FolderOpen, Heart,
  LogOut, Upload, Plus, Image as ImageIcon, Music,
  Film, FileText, File as FileIcon, UserCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLogout } from "../../hooks/use-auth";
import { useState } from "react";
import { UploadModal } from "../../components/UploadModal";
import { CreateFolderModal } from "../../components/CreateFolderModal";

const mainNavItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "All Files", path: "/files", icon: FolderOpen },
  { name: "Favorites", path: "/favorites", icon: Heart },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

const categoryItems = [
  { name: "Photos", path: "/category/image", icon: ImageIcon, color: "text-blue-500" },
  { name: "Videos", path: "/category/video", icon: Film, color: "text-purple-500" },
  { name: "Music", path: "/category/audio", icon: Music, color: "text-yellow-600" },
  { name: "Documents", path: "/category/document", icon: FileText, color: "text-green-600" },
  { name: "Other", path: "/category/other", icon: FileIcon, color: "text-gray-500" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { mutate: logout } = useLogout();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const isActive = (path: string) =>
    location === path || location.startsWith(`${path}/`);

  return (
    <>
      <div className="w-64 h-screen hidden md:flex flex-col bg-card border-r border-border/50 sticky top-0 z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">CloudNest</span>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <Button
            data-testid="button-upload"
            onClick={() => setIsUploadOpen(true)}
            className="w-full rounded-xl flex items-center gap-2 justify-start py-5"
          >
            <Upload className="w-5 h-5" />
            <span className="font-semibold">Upload File</span>
          </Button>

          <Button
            data-testid="button-new-folder"
            onClick={() => setIsFolderOpen(true)}
            variant="outline"
            className="w-full rounded-xl border-dashed border-2 flex items-center gap-2 justify-start py-5"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Folder</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link key={item.path} href={item.path} className="block">
                <div
                  data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive(item.path)
                      ? "bg-foreground/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-6 bg-amber-600 rounded-r-full"
                    />
                  )}
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>

          <div className="pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Categories
            </p>
            <nav className="space-y-1">
              {categoryItems.map((item) => (
                <Link key={item.path} href={item.path} className="block">
                  <div
                    data-testid={`nav-category-${item.name.toLowerCase()}`}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive(item.path)
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 w-1 h-6 bg-amber-600 rounded-r-full"
                      />
                    )}
                    <item.icon className={`w-5 h-5 shrink-0 ${item.color}`} />
                    {item.name}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <Button
            data-testid="button-logout"
            variant="ghost"
            onClick={() => logout()}
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground"
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