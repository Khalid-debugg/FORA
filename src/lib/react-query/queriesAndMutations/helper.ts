import { useQuery } from "@tanstack/react-query";
import { appwriteConfig, storage } from "@/lib/appwrite/config";

interface MediaFile {
  mimeType: string;
  ref: string;
}

export function useMediaFiles(mediaIds: string[]) {
  return useQuery({
    queryKey: ["media-files", mediaIds],
    queryFn: async () => {
      if (!mediaIds || mediaIds.length === 0) return [];

      const fetchedMediaFiles = await Promise.all(
        mediaIds.map(async (id) => {
          const file = await storage.getFile(appwriteConfig.mediaBucketID, id);
          const fileView = storage.getFileView(
            appwriteConfig.mediaBucketID,
            id,
          );
          return { mimeType: file.mimeType, ref: fileView.href };
        }),
      );
      return fetchedMediaFiles;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}
