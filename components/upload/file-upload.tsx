import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { PreviewModal } from "@/components/upload/preview-modal";
import { appToast } from "@/lib/toastify";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface FileWithPreview extends File {
  preview?: string;
  status?: "uploading" | "success" | "error";
  error?: string;
}

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [submitFiles, setSubmitFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const isDuplicateFile = (newFile: File): boolean => {
    return files.some(
      (existingFile) =>
        existingFile.name === newFile.name && existingFile.size === newFile.size
    );
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const duplicates: string[] = [];
      const newFiles = acceptedFiles
        .filter((file) => {
          if (isDuplicateFile(file)) {
            duplicates.push(file.name);
            return false;
          }
          return true;
        })
        .map((file) => ({
          ...file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file),
          status: undefined as FileWithPreview["status"],
        }));

      if (duplicates.length > 0) {
        appToast(`Duplicate files detected: ${duplicates.join(", ")}`, {
          type: "warning",
        });
      }

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
        setSubmitFiles((prev) => [...prev, ...acceptedFiles]);
      }
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handlePreview = async (file: FileWithPreview) => {
    setPreviewFile(file);
    setTextContent("");

    if (file.type === "text/plain") {
      try {
        const text = await file.text();
        setTextContent(text);
      } catch (error) {
        console.error("Error reading text file:", error);
        setTextContent("Error reading file content");
      }
    }
  };

  const uploadFiles = async () => {
    if (submitFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    submitFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("description", description);

    try {
      const response = await axiosInstance.post(
        "/api/v1/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setFiles((prev) =>
              prev.map((file) => ({
                ...file,
                status: percentCompleted === 100 ? "success" : "uploading",
              }))
            );
          },
        }
      );

      appToast("Files uploaded successfully!", {
        type: "success",
      });
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "success",
        }))
      );
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error",
          error: "Failed to upload",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    setSubmitFiles([]);
    setDescription("");
  };

  return (
    <>
      <Card
        {...getRootProps()}
        className={cn(
          "p-8 border-2 border-dashed transition-colors cursor-pointer",
          isDragActive
            ? "border-orange-400 bg-orange-50/50"
            : "border-orange-200 hover:border-orange-300"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-orange-100 rounded-full">
            <Upload className="h-8 w-8 text-orange-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-orange-900">
              {isDragActive ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-orange-600/70 font-light mt-1">
              or click to select files
            </p>
          </div>
          <p className="text-xs text-orange-500/70">Maximum file size: 10MB</p>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-4 mt-4">
          <div className="mb-4">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-orange-900"
            >
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description about these files..."
              className="mt-1 min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p
                        className="font-medium text-orange-900 cursor-pointer"
                        onClick={() => handlePreview(file)}
                      >
                        {file.name}
                      </p>
                      <p className="text-sm text-orange-600/70">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {file.status === "uploading" && (
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
                        <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-150" />
                        <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-300" />
                      </div>
                    )}
                    {file.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {file.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={resetFiles}
              disabled={uploading || files.length === 0}
              className=" bg-gray-600 hover:bg-gray-700 text-white"
            >
              Reset
            </Button>

            <Button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </Card>
      )}
      <PreviewModal
        file={previewFile}
        textContent={textContent}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}
