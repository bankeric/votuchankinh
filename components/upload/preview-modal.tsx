import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { FileWithPreview } from "./file-upload";

interface PreviewModalProps {
  file: FileWithPreview | null;
  textContent: string;
  onClose: () => void;
}

export function PreviewModal({ file, textContent, onClose }: PreviewModalProps) {
  if (!file) return null;

  const renderPreviewContent = () => {
    switch (file.type) {
      case "application/pdf":
        return (
          <iframe
            src={file.preview}
            className="w-full h-[70vh] border-0"
            title={file.name}
          />
        );
      case "text/plain":
        return (
          <div className="w-full h-[70vh] overflow-auto bg-white p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {textContent || "Loading..."}
            </pre>
          </div>
        );
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <div className="flex items-center justify-center h-[70vh] bg-orange-50 rounded-lg">
            <div className="text-center">
              <p className="text-orange-900 font-medium">
                Preview not available for Word documents
              </p>
              <p className="text-orange-600/70 text-sm mt-1">
                Please download the file to view its contents
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[70vh] bg-orange-50 rounded-lg">
            <p className="text-orange-900">Preview not available for this file type</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            {file.name}
          </DialogTitle>
        </DialogHeader>
        {renderPreviewContent()}
      </DialogContent>
    </Dialog>
  );
} 