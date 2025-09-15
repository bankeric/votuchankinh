import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Youtube } from "lucide-react";
import { YouTubeLink } from "./youtube-upload";

interface YouTubePreviewModalProps {
  video: YouTubeLink | null;
  onClose: () => void;
}

export function YouTubePreviewModal({ video, onClose }: YouTubePreviewModalProps) {
  if (!video) return null;

  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            {video.title}
          </DialogTitle>
        </DialogHeader>
        <div className="relative pt-[56.25%] w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-lg text-orange-900">{video.title}</h3>
          <p className="text-sm text-orange-600/70">{video.url}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 