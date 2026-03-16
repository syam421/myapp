import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks/use-files";
import { UploadCloud, File as FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
}

export function UploadModal({ isOpen, onClose, folderId }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: uploadFile, isPending } = useUploadFile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadFile(
      { file: selectedFile, folderId },
      {
        onSuccess: () => {
          setSelectedFile(null);
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md border-border/50 shadow-soft rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload File</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-accent/30"}
                `}
              >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 mx-auto text-primary mb-4" />
                <p className="text-foreground font-medium">
                  {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  or click to select from your computer
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-accent/20 border border-primary/20 rounded-xl p-6 flex items-center space-x-4"
              >
                <div className="bg-primary/20 p-3 rounded-lg text-primary">
                  <FileIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isPending}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            {isPending ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
