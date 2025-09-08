import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Youtube, X, CheckCircle2, AlertCircle, Play } from "lucide-react";
import { YouTubePreviewModal } from "./youtube-preview-modal";
import axiosInstance from "@/lib/axios";

export interface YouTubeLink {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  status?: "uploading" | "success" | "error";
  error?: string;
}

interface YouTubeUploadProps {
  onUploadComplete?: () => void;
}

interface YouTubeMetadata {
  title: string;
  description: string;
  duration: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
}

export function YouTubeUpload({ onUploadComplete }: YouTubeUploadProps) {
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>([]);
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [previewVideo, setPreviewVideo] = useState<YouTubeLink | null>(null);

  const validateYouTubeUrl = (url: string): string | null => {
    const patterns = [
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/,
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})$/,
      /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
    ];


    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const fetchVideoMetadata = async (videoId: string): Promise<YouTubeMetadata> => {
    const response = await axiosInstance.get(`/api/v1/youtube/metadata/${videoId}`);
    return response.data;
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYoutubeError("");

    const videoId = validateYouTubeUrl(youtubeUrl);
    if (!videoId) {
      setYoutubeError("Please enter a valid YouTube URL");
      return;
    }

    if (youtubeLinks.some((link) => link.id === videoId)) {
      setYoutubeError("This video has already been added");
      return;
    }

    const newLink: YouTubeLink = {
      id: videoId,
      url: youtubeUrl,
      title: "Loading...",
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      status: "uploading",
    };

    setYoutubeLinks((prev) => [...prev, newLink]);
    setYoutubeUrl("");

    try {
      const metadata = await fetchVideoMetadata(videoId);
      setYoutubeLinks((prev) =>
        prev.map((link) =>
          link.id === videoId
            ? { 
                ...link, 
                title: metadata.title,
                status: undefined,
                metadata // Store additional metadata if needed
              }
            : link
        )
      );
    } catch (error) {
      console.error("Error fetching video metadata:", error);
      setYoutubeLinks((prev) =>
        prev.map((link) =>
          link.id === videoId
            ? { 
                ...link, 
                status: "error", 
                error: "Failed to fetch video details",
                title: "Error loading video" 
              }
            : link
        )
      );
    }
  };

  const removeYoutubeLink = (id: string) => {
    setYoutubeLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const uploadYoutubeLinks = async () => {
    if (youtubeLinks.length === 0) return;

    setUploading(true);
    try {
      // Here you would make an API call to process the YouTube links
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setYoutubeLinks((prev) =>
        prev.map((link) => ({ ...link, status: "success" }))
      );
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      setYoutubeLinks((prev) =>
        prev.map((link) => ({
          ...link,
          status: "error",
          error: "Failed to process video",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <form onSubmit={handleYoutubeSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Paste YouTube URL here"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Add Video</Button>
          </div>
          {youtubeError && (
            <p className="text-sm text-red-500">{youtubeError}</p>
          )}
        </form>

        {youtubeLinks.length > 0 && (
          <div className="mt-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {youtubeLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="relative w-32 h-20 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => setPreviewVideo(link)}
                      >
                        <img
                          src={link.thumbnail}
                          alt={link.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <p 
                          className="font-medium text-orange-900 cursor-pointer hover:text-orange-700"
                          onClick={() => setPreviewVideo(link)}
                        >
                          {link.title}
                        </p>
                        <p className="text-sm text-orange-600/70">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {link.status === "uploading" && (
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-150" />
                          <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-300" />
                        </div>
                      )}
                      {link.status === "success" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {link.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeYoutubeLink(link.id)}
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
                onClick={uploadYoutubeLinks}
                disabled={uploading || youtubeLinks.length === 0}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                {uploading ? "Processing..." : "Process Videos"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <YouTubePreviewModal
        video={previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </>
  );
} 