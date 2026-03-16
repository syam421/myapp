import { AppLayout } from "@/components/layout/AppLayout";
import { useFiles } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { FileGrid } from "@/components/FileGrid";
import { useLocation } from "wouter";
import { Loader2, ChevronRight, FolderOpen } from "lucide-react";
import { Link } from "wouter";

interface FilesViewProps {
  folderId?: string;
  isFavorites?: boolean;
}

export function FilesView({ folderId, isFavorites }: FilesViewProps) {
  // If we are looking at a specific folder, fetch only items in that folder
  const { data: files, isLoading: filesLoading } = useFiles({ 
    folderId: folderId || (isFavorites ? undefined : "null"),
    isFavorite: isFavorites ? "true" : undefined
  });
  
  const { data: folders, isLoading: foldersLoading } = useFolders({ 
    parentId: folderId || (isFavorites ? "ignore" : "null") // If favorites, don't show folders typically
  });

  const isLoading = filesLoading || foldersLoading;

  const pageTitle = isFavorites 
    ? "Favorites" 
    : folderId 
      ? "Folder Contents" 
      : "All Files";

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-3 font-medium">
            <Link href="/dashboard" className="hover:text-foreground flex items-center">
              <FolderOpen className="w-4 h-4 mr-1" /> My Drive
            </Link>
            {folderId && (
              <>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-foreground">Folder</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <FileGrid 
            files={files} 
            folders={isFavorites ? [] : folders} // Don't show folders in favorites view
          />
        )}
      </div>
    </AppLayout>
  );
}
