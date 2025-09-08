"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Upload, Edit2, Trash2, FileText, File, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useFileManagerStore, CATEGORIES } from "@/store/file-manager"

export function FileManager() {
  const {
    // States
    files,
    isLoading,
    searchTerm,
    selectedCategory,
    uploadDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    currentFile,
    fileContent,
    uploadFile,
    uploadCategory,
    isUploading,
    isSaving,
    isDeleting,

    // Actions
    setSearchTerm,
    setSelectedCategory,
    setUploadDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setUploadFile,
    setUploadCategory,
    setFileContent,
    setCurrentFile,
    fetchFiles,
    handleUpload,
    handleEditOpen,
    handleSaveEdit,
    handleCategoryChange,
    handleDeleteConfirm,
  } = useFileManagerStore()

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Filter files based on search term and selected category
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Trained":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Included in Training":
        return "bg-green-100 text-green-800 border-green-200"
      case "Most Used":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-orange-900 font-serif flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Transcript File Manager
          </CardTitle>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Transcript
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm border-orange-200">
              <DialogHeader>
                <DialogTitle className="text-orange-900 font-serif">Upload Transcript</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-orange-800">
                    Select File (.txt or .pdf)
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".txt,.pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] as File | null)}
                    className="border-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-orange-800">
                    Category
                  </Label>
                  <Select value={uploadCategory} onValueChange={setUploadCategory}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  className="border-orange-300 text-orange-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!uploadFile || isUploading}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
          <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
            <SelectTrigger className="w-full sm:w-[180px] border-orange-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uncategorized">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-orange-600">
              {searchTerm || selectedCategory
                ? "No files match your search criteria."
                : "No transcript files uploaded yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Filename</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Used in QAs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.uuid} className="hover:bg-orange-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {file.type === "application/pdf" ? (
                          <File className="h-5 w-5 text-red-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                        <div>
                          <div className="font-medium text-orange-900">{file.name}</div>
                          <div className="text-xs text-orange-600/70">
                            {formatFileSize(file.size || 0)} • {formatDate(file.updated_at)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={file.category} onValueChange={(value) => handleCategoryChange(file.uuid, value)}>
                        <SelectTrigger className="w-full max-w-[150px] border-orange-200 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(file.status)} font-normal`}>
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-orange-900">{file.used_in_qas}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleEditOpen(file)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentFile(file)
                            setDeleteDialogOpen(true)
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-sm border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-900 font-serif">Edit Transcript: {currentFile?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {currentFile?.category && currentFile.category.charAt(0).toUpperCase() + currentFile.category.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${currentFile ? getStatusColor(currentFile.status) : ""} font-normal`}
                  >
                    {currentFile?.status}
                  </Badge>
                </div>
                <div className="text-sm text-orange-600">Used in {currentFile?.used_in_qas} QA pairs</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-orange-800">
                  Transcript Content
                </Label>
                <Textarea
                  id="content"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="min-h-[400px] border-orange-200 font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-orange-300 text-orange-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-orange-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-orange-900 font-serif flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-medium">{currentFile?.name}</span>?
                {currentFile?.used_in_qas && currentFile.used_in_qas > 0 && (
                  <div className="mt-2 text-red-600">
                    Warning: This file is used in {currentFile.used_in_qas} QA pairs. Deleting it may affect your
                    training data.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-orange-300 text-orange-700">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
