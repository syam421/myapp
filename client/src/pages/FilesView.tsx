import { AppLayout } from "@/components/layout/AppLayout";
import { useFiles } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { FileGrid } from "@/components/FileGrid";
import { Link } from "wouter";
import { Loader2, FolderOpen, Image as ImageIcon, Music, Film, FileText, File as FileIcon, Heart } from "lucide-react";

interface FilesViewProps {
  folderId?: string;
  isFavorites?: boolean;
  category?: string;
  search?: string;
}

const categoryMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  image: { label: "Photos", icon: <ImageIcon className="w-7 h-7" />, color: "text-blue-500" },
  video: { label: "Videos", icon: <Film className="w-7 h-7" />, color: "text-purple-500" },
  audio: { label: "Music", icon: <Music className="w-7 h-7" />, color: "text-yellow-600" },
  document: { label: "Documents", icon: <FileText className="w-7 h-7" />, color: "text-green-600" },
  other: { label: "Other Files", icon: <FileIcon className="w-7 h-7" />, color: "text-gray-500" },
};

export function FilesView({ folderId, isFavorites, category, search }: FilesViewProps) {
  const { data: files, isLoading: filesLoading } = useFiles({
    folderId: category || search || isFavorites ? undefined : (folderId ?? "null"),
    isFavorite: isFavorites ? "true" : undefined,
    category: category,
    search: search,
  });

  const { data: folders, isLoading: foldersLoading } = useFolders({
    parentId: category || search || isFavorites ? "ignore" : (folderId ?? "null"),
  });

  const isLoading = filesLoading || (foldersLoading && !category && !search && !isFavorites);

  const meta = category ? categoryMeta[category] : null;
  const pageTitle = isFavorites
    ? "Favorites"
    : search
    ? `Search: "${search}"`
    : meta
    ? meta.label
    : folderId
    ? "Folder Contents"
    : "All Files";

  const showFolders = !isFavorites && !category && !search;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-3 font-medium gap-1">
            <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
              <FolderOpen className="w-4 h-4" /> My Drive
            </Link>
            {(folderId || category || isFavorites || search) && (
              <>
                <span className="mx-1">/</span>
                <span className="text-foreground">{pageTitle}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {meta && (
              <span className={meta.color}>{meta.icon}</span>
            )}
            {isFavorites && <Heart className="w-7 h-7 text-red-500 fill-red-500" />}
            <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
          </div>
          {search && (
            <p className="text-muted-foreground mt-1">
              {files?.length ?? 0} result{(files?.length ?? 0) !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <FileGrid
            files={files}
            folders={showFolders ? folders : []}
          />
        )}
      </div>
    </AppLayout>
  );
}
