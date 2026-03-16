import { type File as FileType, type Folder as FolderType } from "@shared/schema";
import { Folder, Image as ImageIcon, FileText, Film, Music, File as GenericFile, MoreVertical, Trash2, Heart, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDeleteFile, useUpdateFile } from "@/hooks/use-files";
import { useDeleteFolder } from "@/hooks/use-folders";
import { format } from "date-fns";

interface FileGridProps {
  files?: FileType[];
  folders?: FolderType[];
}

export function FileGrid({ files = [], folders = [] }: FileGridProps) {
  const isEmpty = files.length === 0 && folders.length === 0;

  if (isEmpty) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-accent/30 rounded-full flex items-center justify-center mb-4 text-primary">
          <Folder className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold mb-2">This folder is empty</h3>
        <p className="text-muted-foreground">Upload files or create folders to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {folders.map((folder, i) => (
        <FolderCard key={folder.id} folder={folder} index={i} />
      ))}
      {files.map((file, i) => (
        <FileCard key={file.id} file={file} index={i + folders.length} />
      ))}
    </div>
  );
}

function FolderCard({ folder, index }: { folder: FolderType, index: number }) {
  const { mutate: deleteFolder } = useDeleteFolder();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-accent/10 border border-accent/30 rounded-2xl p-5 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <Link href={`/folder/${folder.id}`}>
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <Folder className="w-6 h-6 fill-primary/40" />
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-soft border-border/50">
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => deleteFolder(folder.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Link href={`/folder/${folder.id}`}>
        <h3 className="font-semibold text-lg truncate mb-1">{folder.name}</h3>
        <p className="text-xs text-muted-foreground">
          {format(new Date(folder.createdAt), "MMM d, yyyy")}
        </p>
      </Link>
    </motion.div>
  );
}

function FileCard({ file, index }: { file: FileType, index: number }) {
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: updateFile } = useUpdateFile();

  const getIcon = () => {
    switch (file.category) {
      case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'video': return <Film className="w-6 h-6 text-purple-500" />;
      case 'audio': return <Music className="w-6 h-6 text-yellow-600" />;
      case 'document': return <FileText className="w-6 h-6 text-green-500" />;
      default: return <GenericFile className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (file.category) {
      case 'image': return 'bg-blue-50';
      case 'video': return 'bg-purple-50';
      case 'audio': return 'bg-yellow-50';
      case 'document': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border/50 rounded-2xl p-5 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${getBgColor()} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
          {getIcon()}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-soft border-border/50">
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => updateFile({ id: file.id, isFavorite: !file.isFavorite })}
            >
              <Heart className={`w-4 h-4 mr-2 ${file.isFavorite ? "fill-red-500 text-red-500" : ""}`} /> 
              {file.isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(file.url, '_blank')}>
              <Download className="w-4 h-4 mr-2" /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => deleteFile(file.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-auto">
        <h3 className="font-semibold text-base truncate mb-1" title={file.filename}>
          {file.filename}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <span>{format(new Date(file.createdAt), "MMM d")}</span>
        </div>
      </div>
    </motion.div>
  );
}
