import { AppLayout } from "@/components/layout/AppLayout";
import { useUser } from "@/hooks/use-auth";
import { useStats } from "@/hooks/use-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HardDrive, File as FileIcon, Image as ImageIcon, Film, Music, FileText } from "lucide-react";
import { motion } from "framer-motion";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const TOTAL_SPACE = 10 * 1024 * 1024 * 1024; // 10 GB

const categoryConfig = [
  { key: "image",    label: "Photos",    icon: ImageIcon, color: "text-blue-500",   bg: "bg-blue-50" },
  { key: "video",    label: "Videos",    icon: Film,      color: "text-purple-500", bg: "bg-purple-50" },
  { key: "audio",    label: "Music",     icon: Music,     color: "text-yellow-600", bg: "bg-yellow-50" },
  { key: "document", label: "Documents", icon: FileText,  color: "text-green-600",  bg: "bg-green-50" },
  { key: "other",    label: "Other",     icon: FileIcon,  color: "text-gray-500",   bg: "bg-gray-50" },
];

export function Profile() {
  const { data: user } = useUser();
  const { data: stats } = useStats();

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const usedBytes = stats?.totalSize ?? 0;
  const usedPercent = Math.min(100, Math.round((usedBytes / TOTAL_SPACE) * 100));

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-3xl"
      >
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* Profile card */}
        <Card className="rounded-2xl border-border/50">
          <CardContent className="pt-6 flex items-center gap-6">
            <Avatar className="h-20 w-20 text-2xl">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold truncate">{user?.name}</h2>
              <p className="text-muted-foreground truncate">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">Free Plan</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HardDrive className="w-5 h-5" /> Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{formatBytes(usedBytes)} used</span>
                <span className="font-medium">10 GB total</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{usedPercent}% of 10 GB used</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {categoryConfig.map(({ key, label, icon: Icon, color, bg }) => {
                const bytes = stats?.categories?.[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background">
                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold truncate">{formatBytes(bytes)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Account details */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50">
            {[
              { label: "Full Name", value: user?.name },
              { label: "Email Address", value: user?.email },
              { label: "Plan", value: "Free (10 GB)" },
              { label: "Total Files", value: stats?.totalFiles ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
