"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FolderOpen, Edit2, Trash2, Upload, AlertCircle } from "lucide-react"
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
import { appToast } from "@/lib/toastify"
import { useFileManagerStore, CATEGORIES } from "@/store/file-manager"

export function TrainingFileManager() {
  const {
    // States
    trainingFiles: files,
    isLoadingTraining: isLoading,
    editDialogOpen,
    deleteDialogOpen,
    currentFile,
    fileContent,
    isSaving,
    isDeleting,

    // Actions
    setEditDialogOpen,
    setDeleteDialogOpen,
    setFileContent,
    setCurrentFile,
    fetchTrainingFiles,
    handleEditOpen,
    handleSaveEdit,
    handleCategoryChange,
    handleDeleteConfirm,
  } = useFileManagerStore()

  // Fetch files on component mount
  useEffect(() => {
    fetchTrainingFiles()
  }, [fetchTrainingFiles])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-orange-900 font-serif flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />📁 Training File Manager
          </CardTitle>
          <Button
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
            onClick={() => appToast("File upload feature will be available soon.", { type: "info" })}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-orange-600">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <p className="text-lg font-medium">No training files found</p>
            <p className="text-sm text-orange-500 mt-1">Upload transcript files to get started with training</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Filename</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Used in QAs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.uuid} className="hover:bg-orange-50/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-orange-900 font-serif">{file.name}</div>
                        <div className="text-xs text-orange-600/70">Updated {formatDate(file.updated_at)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={file.category} onValueChange={(value) => handleCategoryChange(file.uuid, value)}>
                        <SelectTrigger className="w-full max-w-[140px] border-orange-200 h-8 text-sm">
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
                      <Badge variant="outline" className={`${getStatusColor(file.status)} font-normal text-xs`}>
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
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-sm border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-900 font-serif">
                Edit Training File: {currentFile?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-orange-800">
                    Category
                  </Label>
                  <Select 
                    value={currentFile?.category || ""} 
                    onValueChange={(value) => handleCategoryChange(currentFile?.uuid || "", value)}
                  >
                    <SelectTrigger className="border-orange-200">
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
                </div>
                <div className="space-y-2">
                  <Label className="text-orange-800">Current Status</Label>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`${currentFile ? getStatusColor(currentFile.status) : ""} font-normal`}
                    >
                      {currentFile?.status}
                    </Badge>
                    <span className="text-sm text-orange-600">Used in {currentFile?.used_in_qas} QA pairs</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-orange-800">
                  File Content
                </Label>
                <Textarea
                  id="content"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="min-h-[300px] border-orange-200 font-mono text-sm"
                  placeholder="Loading file content..."
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
