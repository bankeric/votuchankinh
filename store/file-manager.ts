import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appToast } from "@/lib/toastify";
import { fileService } from "@/service/files";
import { File } from "@/interfaces/file";

export const CATEGORIES = [
  "karma",
  "mindfulness",
  "meditation",
  "compassion",
  "wisdom",
  "ethics",
  "impermanence",
  "suffering",
  "non-self",
  "enlightenment",
  "Q&A",
  "uncategorized",
] as const;

interface FileManagerState {
  // States
  files: File[];
  trainingFiles: File[];
  isLoading: boolean;
  isLoadingTraining: boolean;
  searchTerm: string;
  selectedCategory: string | null;
  uploadDialogOpen: boolean;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  currentFile: File | null;
  fileContent: string;
  uploadFile: File | null;
  uploadCategory: string;
  isUploading: boolean;
  isSaving: boolean;
  isDeleting: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setUploadDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setUploadFile: (file: File | null) => void;
  setUploadCategory: (category: string) => void;
  setFileContent: (content: string) => void;
  setCurrentFile: (file: File | null) => void;
  
  // Async Actions
  fetchFiles: () => Promise<void>;
  fetchTrainingFiles: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleEditOpen: (file: File) => Promise<void>;
  handleSaveEdit: () => Promise<void>;
  handleCategoryChange: (fileId: string, newCategory: string) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
}

export const useFileManagerStore = create<FileManagerState>()(
  persist(
    (set, get) => ({
      // Initial states
      files: [],
      trainingFiles: [],
      isLoading: false,
      isLoadingTraining: false,
      searchTerm: "",
      selectedCategory: "uncategorized",
      uploadDialogOpen: false,
      editDialogOpen: false,
      deleteDialogOpen: false,
      currentFile: null,
      fileContent: "",
      uploadFile: null,
      uploadCategory: "uncategorized",
      isUploading: false,
      isSaving: false,
      isDeleting: false,

      // State setters
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setUploadDialogOpen: (open) => set({ uploadDialogOpen: open }),
      setEditDialogOpen: (open) => set({ editDialogOpen: open }),
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
      setUploadFile: (file) => set({ uploadFile: file }),
      setUploadCategory: (category) => set({ uploadCategory: category }),
      setFileContent: (content) => set({ fileContent: content }),
      setCurrentFile: (file) => set({ currentFile: file }),

      // Async actions
      fetchFiles: async () => {
        set({ isLoading: true });
        try {
          const files = await fileService.list();
          set({ files });
        } catch (error) {
          console.error("Error fetching files:", error);
          appToast("Failed to load files. Please try again.", {
            type: "error",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTrainingFiles: async () => {
        set({ isLoadingTraining: true });
        try {
          const files = await fileService.list();
          set({ trainingFiles: files });
        } catch (error) {
          console.error("Error fetching training files:", error);
          appToast("Failed to load training files. Please try again.", {
            type: "error",
          });
        } finally {
          set({ isLoadingTraining: false });
        }
      },

      handleUpload: async () => {
        const { uploadFile, uploadCategory } = get();
        if (!uploadFile) return;

        set({ isUploading: true });
        try {
        //   const file = await fileService.upload(uploadFile, uploadCategory);
        //   set((state) => ({ 
        //     files: [file, ...state.files],
        //     uploadFile: null,
        //     uploadCategory: "uncategorized",
        //     uploadDialogOpen: false 
        //   }));
        //   appToast("File uploaded successfully", {
        //     type: "success",
        //   });
        } catch (error) {
          console.error("Error uploading file:", error);
          appToast("Failed to upload file. Please try again.", {
            type: "error",
          });
        } finally {
          set({ isUploading: false });
        }
      },

      handleEditOpen: async (file: File) => {
        set({ currentFile: file, editDialogOpen: true });

        try {
        //   const content = await fileService.getContent(file.id);
        //   set({ fileContent: content });
        } catch (error) {
          console.error("Error fetching file content:", error);
          appToast("Failed to load file content. Please try again.", {
            type: "error",
          });
        }
      },

      handleSaveEdit: async () => {
        const { currentFile, fileContent } = get();
        if (!currentFile) return;

        set({ isSaving: true });
        try {
        //   const file = await fileService.update({
        //     id: currentFile.id,
        //     content: fileContent,
        //     category: currentFile.category,
        //   });
          
        //   set((state) => ({
        //     files: state.files.map((f) =>
        //       f.id === currentFile.id ? { ...f, updated_at: file.updated_at } : f
        //     ),
        //     trainingFiles: state.trainingFiles.map((f) =>
        //       f.id === currentFile.id ? { ...f, updated_at: file.updated_at } : f
        //     ),
        //     editDialogOpen: false,
        //   }));
        //   appToast("File updated successfully", {
        //     type: "success",
        //   });
        } catch (error) {
          console.error("Error updating file:", error);
          appToast("Failed to update file. Please try again.", {
            type: "error",
          });
        } finally {
          set({ isSaving: false });
        }
      },

      handleCategoryChange: async (fileId: string, newCategory: string) => {
        try {
        //   const file = await fileService.update({
        //     id: fileId,
        //     category: newCategory,
        //   });
          
        //   set((state) => ({
        //     files: state.files.map((f) =>
        //       f.id === fileId ? { ...f, category: newCategory, updated_at: file.updated_at } : f
        //     ),
        //     trainingFiles: state.trainingFiles.map((f) =>
        //       f.id === fileId ? { ...f, category: newCategory, updated_at: file.updated_at } : f
        //     ),
        //   }));
        //   appToast("Category updated successfully", {
        //     type: "success",
        //   });
        } catch (error) {
          console.error("Error updating category:", error);
          appToast("Failed to update category. Please try again.", {
            type: "error",
          });
        }
      },

      handleDeleteConfirm: async () => {
        const { currentFile } = get();
        if (!currentFile) return;

        set({ isDeleting: true });
        try {
        //   await fileService.delete(currentFile.id);
        //   set((state) => ({
        //     files: state.files.filter((file) => file.id !== currentFile.id),
        //     trainingFiles: state.trainingFiles.filter((file) => file.id !== currentFile.id),
        //     deleteDialogOpen: false,
        //   }));
        //   appToast("File deleted successfully", {
        //     type: "success",
        //   });
        } catch (error) {
          console.error("Error deleting file:", error);
          appToast("Failed to delete file. Please try again.", {
            type: "error",
          });
        } finally {
          set({ isDeleting: false });
        }
      },
    }),
    {
      name: "buddha-ai-file-manager",
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
); 