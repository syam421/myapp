import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFolder } from "@/hooks/use-folders";
import { FolderPlus } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string;
}

export function CreateFolderModal({ isOpen, onClose, parentId }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const { mutate: createFolder, isPending } = useCreateFolder();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    createFolder(
      { name: name.trim(), parentId: parentId ? parseInt(parentId) : null },
      {
        onSuccess: () => {
          setName("");
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md border-border/50 shadow-soft rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-primary" />
            New Folder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleCreate} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="e.g. Project Documents"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border bg-background focus-visible:ring-primary/50"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || isPending}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
