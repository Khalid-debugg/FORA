import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X } from "lucide-react";

interface MediaFile {
  mimeType: string;
  ref: string;
}

interface MediaCarouselDialogProps {
  mediaFiles: MediaFile[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
  showCarousel?: boolean;
}

export default function MediaCarouselDialog({
  mediaFiles,
  isOpen,
  onOpenChange,
  initialIndex = 0,
  showCarousel = true,
}: MediaCarouselDialogProps) {
  const renderMedia = (media: MediaFile, index: number) => {
    if (media?.mimeType.includes("image")) {
      return (
        <img
          src={media?.ref || "/placeholder.svg"}
          alt={`Media ${index + 1}`}
          className="max-h-[80vh] object-contain w-full rounded-md"
          loading="lazy"
        />
      );
    } else if (media?.mimeType.includes("video")) {
      return (
        <div className="relative rounded-md overflow-hidden">
          <video
            className="max-h-[80vh] w-full object-contain"
            src={media?.ref}
            controls
            playsInline
            crossOrigin="anonymous"
          />
        </div>
      );
    }
    return (
      <div className="bg-red-50 text-red-500 p-10 flex justify-center items-center font-bold rounded-md">
        Media type is not supported
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
        <div className="absolute top-4 right-4 z-50">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        <div className="w-full h-full flex items-center justify-center p-4">
          {showCarousel && mediaFiles?.length > 1 ? (
            <Carousel
              opts={{
                startIndex: initialIndex,
              }}
              className="w-full"
            >
              <CarouselContent>
                {mediaFiles?.map((media, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center"
                  >
                    {renderMedia(media, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-none" />
              <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-none" />
            </Carousel>
          ) : (
            <div className="flex items-center justify-center">
              {renderMedia(
                mediaFiles?.[initialIndex] || mediaFiles?.[0],
                initialIndex,
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
