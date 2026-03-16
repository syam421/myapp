import { AppLayout } from "@/components/layout/AppLayout";
import { useStats } from "@/hooks/use-stats";
import { useFiles } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { FileGrid } from "@/components/FileGrid";
import { HardDrive, File as FileIcon, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: files, isLoading: filesLoading } = useFiles({ folderId: "null" }); // Root files
  const { data: folders, isLoading: foldersLoading } = useFolders({ parentId: "null" }); // Root folders

  const isLoading = statsLoading || filesLoading || foldersLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Transform stats categories for chart
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  const chartData = stats?.categories 
    ? Object.entries(stats.categories).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      })).filter(d => d.value > 0)
    : [];

  const totalSpaceGB = 10; // Mock total space constraint
  const usedSpaceGB = (stats?.totalSize || 0) / (1024 * 1024 * 1024);
  const percentUsed = Math.min(100, Math.round((usedSpaceGB / totalSpaceGB) * 100));

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Storage Overview</h1>
          <p className="text-muted-foreground">Monitor your personal cloud usage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 shadow-soft text-primary-foreground col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-[40px] -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Storage Capacity</h2>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black">{usedSpaceGB.toFixed(2)} GB</span>
                <span className="text-lg font-medium opacity-80 mb-1">/ {totalSpaceGB} GB used</span>
              </div>
              <div className="w-full bg-primary-foreground/20 rounded-full h-3 mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentUsed}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-white rounded-full h-3"
                />
              </div>
              <p className="text-sm font-medium opacity-90">{percentUsed}% capacity reached</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-soft flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-foreground mb-4 self-start">Space by Category</h3>
            {chartData.length > 0 ? (
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => `${(value / 1024 / 1024).toFixed(2)} MB`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col">
                <FileIcon className="w-8 h-8 mb-2 opacity-50" />
                <p>No files yet</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Files & Folders</h2>
          </div>
          <FileGrid files={files} folders={folders} />
        </div>
      </motion.div>
    </AppLayout>
  );
}
