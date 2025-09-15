"use client";

import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useKnowledge } from "@/hooks/use-knowledge";
import { useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { appToast } from "@/lib/toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KnowledgeUploadProps {
  isMobile?: boolean;
}

export function KnowledgeUpload({ isMobile = false }: KnowledgeUploadProps) {
  const { t } = useTranslation();
  const {
    isLoading,
    selectedAgentId,
    files,
    handleUploadFiles,
    handleRemoveFile: removeFile,
    handleGetFiles,
  } = useKnowledge();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleGetFiles();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      await handleFileUpload(droppedFiles);
    }
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        await handleFileUpload(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [selectedAgentId]
  );

  const handleFileUpload = useCallback(async (files: File[]) => {
    console.log("handleFileUpload selectedAgentId", selectedAgentId);

    setUploadLoading(true);
    try {
      // Show initial upload starting toast
      // appToast(`Starting upload of ${files.length} file${files.length > 1 ? 's' : ''}...`, {
      //   type: "info",
      //   autoClose: 2000,
      // });

      await handleUploadFiles(files);

      // Refresh the file list after upload
      // await handleGetFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
      appToast("Upload failed. Please try again.", {
        type: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  }, [selectedAgentId]);

  const handleRemoveFile = async (fileId: string) => {
    try {
      await removeFile(fileId);
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const openDeleteDialog = (file: { id: string; name: string }) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      await handleRemoveFile(fileToDelete.id);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Knowledge Upload */}
      <div>
        <Label
          className={isMobile ? "text-sm font-medium" : "text-base font-medium"}
        >
          {t("gptEditor.knowledge.title")}
        </Label>
        <div className="mt-2 space-y-3">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg text-center transition-colors",
              isMobile ? "p-4" : "p-6",
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600",
              uploadLoading && "opacity-50 pointer-events-none"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadLoading ? (
              <Loader2
                className={`mx-auto mb-2 text-blue-500 animate-spin ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            ) : (
              <Upload
                className={`mx-auto mb-2 text-gray-400 ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            )}
            <p
              className={`text-gray-500 mb-2 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {uploadLoading
                ? t("gptEditor.knowledge.uploading") || "Uploading..."
                : t("gptEditor.knowledge.uploadText")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={uploadLoading}
            >
              {t("gptEditor.knowledge.selectFile")}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              {t("gptEditor.knowledge.supportedFormats")}
            </p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              {t("gptEditor.knowledge.uploadedFiles")}
            </h3>
            {isLoading && (
              <Loader2
                className={`mx-auto mb-2 text-blue-500 animate-spin ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            )}
            {!isLoading && files.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                {t("gptEditor.knowledge.noFiles") || "No files uploaded yet"}
              </p>
            ) : (
              !isLoading &&
              files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between border rounded-lg ${
                    isMobile ? "p-2" : "p-3"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileIcon fileName={file.name} />
                    <div>
                      <p
                        className={`font-medium ${
                          isMobile ? "text-xs" : "text-sm"
                        }`}
                      >
                        {file.display_name || file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.create_time
                          ? new Date(file.create_time).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-0 ${isMobile ? "h-6 w-6" : "h-8 w-8"}`}
                    onClick={() =>
                      openDeleteDialog({
                        id: file.id,
                        name: file.display_name || file.name,
                      })
                    }
                    disabled={uploadLoading}
                  >
                    <X className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900 font-serif flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              {t("gptEditor.knowledge.deleteConfirmTitle") ||
                "Confirm File Deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("gptEditor.knowledge.deleteConfirmDescription") ||
                "Are you sure you want to delete"}
              <span className="font-medium"> {fileToDelete?.name}</span>?
              <div className="mt-2 text-red-600">
                {t("gptEditor.knowledge.deleteWarning") ||
                  "This action cannot be undone."}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700">
              {t("gptEditor.knowledge.deleteConfirmCancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("gptEditor.knowledge.deleteConfirmDelete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper component for file icons
function FileIcon({ fileName }: { fileName: string }) {
  if (fileName.endsWith(".txt")) {
    return <FileText className="w-4 h-4 text-blue-500" />;
  } else if (fileName.endsWith(".pdf")) {
    return <FileText className="w-4 h-4 text-red-500" />;
  } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
    return <FileText className="w-4 h-4 text-blue-600" />;
  } else if (fileName.endsWith(".md")) {
    return <FileText className="w-4 h-4 text-green-500" />;
  } else {
    return <FileText className="w-4 h-4 text-gray-500" />;
  }
}
