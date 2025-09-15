"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, File } from "lucide-react"
import type { UploadedFile, TrainingEntry } from "@/app/admin/page"
import { appToast } from "@/lib/toastify"

interface UploadSectionProps {
  onFileUploaded: (file: Omit<UploadedFile, "id" | "timestamp">) => void
  onTrainingEntryAdded: (entry: Omit<TrainingEntry, "id" | "timestamp">) => void
}

export function UploadSection({ onFileUploaded, onTrainingEntryAdded }: UploadSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const processTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const processPDFFile = async (file: File): Promise<string> => {
    // Mock PDF processing - in a real implementation, you'd use a library like pdf-parse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `[PDF Content from ${file.name}]\n\nThis is mock extracted text from the PDF file. In a real implementation, this would contain the actual extracted text content from the PDF document.`,
        )
      }, 2000)
    })
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsProcessing(true)

    try {
      for (const file of Array.from(files)) {
        let content: string
        let type: "text" | "pdf"

        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          content = await processTextFile(file)
          type = "text"
        } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          content = await processPDFFile(file)
          type = "pdf"
        } else {
          appToast(`${file.name} is not a supported file type. Please upload .txt or .pdf files.`, {
            type: "error",
          })
          continue
        }

        // Add to uploaded files
        onFileUploaded({
          name: file.name,
          content,
          type,
          processed: true,
        })

        // Auto-generate training entries from content (simple example)
        const lines = content.split("\n").filter((line) => line.trim().length > 0)
        if (lines.length >= 2) {
          // Create a sample training entry from the first few lines
          onTrainingEntryAdded({
            instruction: `Based on the content from ${file.name}, please provide guidance.`,
            response: lines.slice(0, 3).join(" "),
            source: "transcript",
            sourceFile: file.name,
          })
        }

        appToast(`${file.name} has been successfully processed and added to training data.`, {
          type: "success",
        })
      }
    } catch (error) {
      appToast("Failed to process one or more files. Please try again.", {
        type: "error",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }, [])

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900 font-serif flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Training Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-orange-400 bg-orange-50"
              : "border-orange-300 hover:border-orange-400 hover:bg-orange-50/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <FileText className="h-12 w-12 text-orange-400" />
              <File className="h-12 w-12 text-orange-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-orange-900">Drop files here or click to upload</p>
              <p className="text-sm text-orange-600 mt-1">Supports .txt and .pdf files</p>
            </div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" disabled={isProcessing} className="bg-orange-600 hover:bg-orange-700 text-white">
                {isProcessing ? "Processing..." : "Choose Files"}
              </Button>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept=".txt,.pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
              <span className="text-orange-800">Processing files and extracting training data...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
