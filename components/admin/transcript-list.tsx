"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Trash2, Eye, FileText, File } from "lucide-react"
import type { UploadedFile } from "@/app/admin/page"

interface TranscriptListProps {
  files: UploadedFile[]
  onDeleteFile: (id: string) => void
}

export function TranscriptList({ files, onDeleteFile }: TranscriptListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900 font-serif flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Uploaded Files ({files.length})
          </div>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-orange-200 focus:border-orange-400"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-orange-600">
                {searchTerm ? "No files match your search." : "No files uploaded yet."}
              </div>
            ) : (
              filteredFiles.map((file) => (
                <Card key={file.id} className="border border-orange-200/50 hover:border-orange-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {file.type === "pdf" ? (
                          <File className="h-8 w-8 text-red-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-blue-500" />
                        )}
                        <div>
                          <h3 className="font-medium text-orange-900 truncate max-w-[300px]">{file.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                file.type === "pdf" ? "border-red-300 text-red-700" : "border-blue-300 text-blue-700"
                              }
                            >
                              {file.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-orange-600">{formatFileSize(file.content)}</span>
                            <span className="text-xs text-orange-600">{formatDate(file.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] bg-white/95 backdrop-blur-sm border-orange-200">
                            <DialogHeader>
                              <DialogTitle className="text-orange-900 font-serif">{file.name}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] pr-4">
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <pre className="whitespace-pre-wrap text-sm text-orange-900 font-light leading-relaxed">
                                  {file.content}
                                </pre>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => onDeleteFile(file.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
