"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface TextUploadProps {
  onUploadComplete?: () => void;
}

interface TextDocument {
  id: string;
  content: string;
  title: string;
  status?: "uploading" | "success" | "error";
  error?: string;
}

export function TextUpload({ onUploadComplete }: TextUploadProps) {
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<TextDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleAddDocument = () => {
    if (!textContent.trim()) return;

    const newDoc: TextDocument = {
      id: crypto.randomUUID(),
      content: textContent,
      title: title.trim() || `Document ${documents.length + 1}`,
      status: undefined,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setTextContent("");
    setTitle("");
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const uploadDocuments = async () => {
    if (documents.length === 0) return;

    setUploading(true);
    try {
      const response = await axiosInstance.post("/api/v1/documents/text", {
        documents: documents.map(({ id, content, title }) => ({
          content,
          title,
        })),
      });

      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          status: "success",
        }))
      );
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          status: "error",
          error: "Failed to upload",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title (optional)"
            className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste your text here..."
            className="min-h-[200px] border-orange-200 focus:border-orange-400"
          />
          <Button
            onClick={handleAddDocument}
            disabled={!textContent.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            Add Document
          </Button>
        </div>

        {documents.length > 0 && (
          <div className="mt-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-900">
                          {doc.title}
                        </p>
                        <p className="text-sm text-orange-600/70">
                          {doc.content.length} characters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {doc.status === "uploading" && (
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-150" />
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-300" />
                        </div>
                      )}
                      {doc.status === "success" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {doc.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={uploadDocuments}
                disabled={uploading || documents.length === 0}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                {uploading ? "Uploading..." : "Upload Documents"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 