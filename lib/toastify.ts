import { toast, Bounce, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches
    ? 'top-right'
    : 'bottom-right',
  autoClose: 9000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const appToast = (message: string, options: ToastOptions = {}) =>
  toast(message, {
    ...defaultOptions,
    ...options,
  });

export const appToastLoading = (message: string, options: ToastOptions = {}) =>
  toast.loading(message, {
    ...defaultOptions,
    ...options,
    isLoading: true,
  });

export const appToastPromise = (
  promise: Promise<void>,
  message: { pending: string; success: string; error: string },
  options: ToastOptions = {}
) =>
  toast.promise(promise, message, {
    ...defaultOptions,
    ...options,
  });

// i18n-aware upload toasts. Pass `t` from useTranslations when available
export const appToastUpload = (
  update: any,
  t?: (key: string, params?: Record<string, any>) => string
) => {
  const {
    status,
    filename,
    progress,
    message,
    error,
    successful_count,
    failed_count,
  } = update;

  switch (status) {
    case "uploading":
      toast.info(
        t
          ? t('upload.uploading', { filename, progress })
          : `📤 Uploading ${filename}... (${progress})`,
        {
        autoClose: 3000,
        position: "bottom-right",
      }
      );
      break;
    case "success":
      toast.success(
        t ? t('upload.success', { filename }) : `✅ ${filename} uploaded successfully`,
        {
        autoClose: 4000,
        position: "bottom-right",
      }
      );
      break;
    case "failed":
      toast.error(
        t
          ? t('upload.failed', { filename, error })
          : `❌ Failed to upload ${filename}: ${error}`,
        {
        autoClose: 5000,
        position: "bottom-right",
      }
      );
      break;
    case "completed":
      toast.success(
        t
          ? t('upload.completed', {
              successful: successful_count,
              failed: failed_count,
            })
          : `🎉 Upload completed! ${successful_count} successful, ${failed_count} failed`,
        {
          autoClose: 6000,
          position: "bottom-right",
        }
      );
      break;
    default:
      if (message) {
        toast.info(t ? t('upload.info', { message }) : message, {
          autoClose: 3000,
          position: "bottom-right",
        });
      }
  }
};

export function handleUploadEvent(
  event: any,
  uploadId: string | number | null
) {
  let uploadToastId = uploadId;
  switch (event.status) {
    case "starting_upload":
      if (uploadToastId) {
        toast.update(uploadToastId, {
          ...defaultOptions,
          render: event.message,
          type: "info",
          isLoading: true,
        });
      }
      break;

    case "uploading":
      if (uploadToastId) {
        toast.update(uploadToastId, {
          ...defaultOptions,
          render: event.message,
          type: "info",
          isLoading: true,
        });
      }
      break;

    case "success":
      if (uploadToastId) {
        toast.update(uploadToastId, {
          ...defaultOptions,
          render: event.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      break;

    case "failed":
      if (uploadToastId) {
        toast.update(uploadToastId, {
          ...defaultOptions,
          render: event.message,
          type: "error",
          isLoading: false, 
          autoClose: 3000,
        });
      }
      break;

    case "completed":
      if (uploadToastId) {
        toast.update(uploadToastId, {
          ...defaultOptions,
          render: event.message,
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        uploadToastId = null; // Reset
      }
      break;

    default:
      // toast(event.message); // fallback for unknown status
      break;
  }
}

export function handleAgentCreationEvent(
  event: any,
  toastId: string | number | null,
  t: (key: string, params?: any) => string
): string | number | null {
  let currentToastId = toastId;
  
  switch (event.status) {
    case "creating_corpus":
      currentToastId = toast(t('agentCreation.creatingCorpus'), {
        ...defaultOptions,
        type: "info",
        isLoading: true,
        autoClose: false,
      });
      break;

    case "corpus_created":
      if (currentToastId) {
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.corpusCreated'),
          type: "success",
          isLoading: true, // Keep loading for next step
          autoClose: false,
        });
      }
      break;

    case "starting_upload":
      if (currentToastId) {
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.startingUpload', { count: event.total_files }),
          type: "info",
          isLoading: true,
          autoClose: false,
        });
      }
      break;

    case "preparing":
      if (currentToastId) {
        const progressText = event.progress ? ` ${t('agentCreation.progress', { 
          current: event.progress.split('/')[0], 
          total: event.progress.split('/')[1] 
        })}` : '';
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.preparing', { filename: event.filename }) + progressText,
          type: "info",
          isLoading: true,
          autoClose: false,
        });
      }
      break;

    case "uploading":
      if (currentToastId) {
        const progressText = event.progress ? ` ${t('agentCreation.progress', { 
          current: event.progress.split('/')[0], 
          total: event.progress.split('/')[1] 
        })}` : '';
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.uploading', { filename: event.filename }) + progressText,
          type: "info",
          isLoading: true,
          autoClose: false,
        });
      }
      break;

    case "success":
      if (currentToastId && event.filename) {
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.fileUploaded', { filename: event.filename }),
          type: "success",
          isLoading: true, // Keep loading for potential next files
          autoClose: false,
        });
      }
      break;

    case "failed":
      if (currentToastId && event.filename) {
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.uploadFailed', { filename: event.filename }),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      break;

    case "completed":
      if (currentToastId) {
        toast.update(currentToastId, {
          ...defaultOptions,
          render: t('agentCreation.uploadCompleted', { 
            successful: event.successful_count, 
            total: event.total_files 
          }),
          type: event.failed_count > 0 ? "warning" : "success",
          isLoading: false,
          autoClose: 5000,
        });
        return null; // Reset toast ID
      }
      break;

    default:
      // Fallback for unknown status
      if (event.message) {
        currentToastId = toast(event.message, {
          ...defaultOptions,
          type: "info",
          autoClose: 3000,
        });
      }
      break;
  }

  return currentToastId;
}
