import { useImageUploadAndCrop } from "@/hooks/useImageUploadAndCrop";
import { useChangeCoverImage } from "@/lib/react-query/queriesAndMutations/Profile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactCrop from "react-image-crop";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";
import { IoCamera } from "react-icons/io5";
import MediaCarouselDialog from "../MediaCarouselDialog";
import { useState } from "react";

const CoverImage = ({ user, currentUser }) => {
  const { mutateAsync: changeCoverImage, isPending: isChangingCoverImage } =
    useChangeCoverImage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const openMediaDialog = (index: number) => {
    setInitialIndex(index);
    setDialogOpen(true);
  };
  const {
    image,
    tempImage,
    crop,
    isDialogOpen,
    imageRef,
    setCrop,
    setIsDialogOpen,
    handleImageUpload,
    handleSave,
  } = useImageUploadAndCrop(
    async (file) => changeCoverImage({ file, userId: user?.$id }),
    user?.coverUrl || "/assets/images/gray-texture.jpg",
  );

  return (
    <div className="relative w-full h-56 bg-gray-200">
      <img
        onClick={() => openMediaDialog(0)}
        src={image}
        alt="Cover Image"
        className="w-full h-full object-cover hover:cursor-pointer"
        loading="lazy"
      />
      <MediaCarouselDialog
        mediaFiles={[
          {
            mimeType: "image/png",
            ref: user?.coverUrl || "/assets/images/gray-texture.jpg",
          },
        ]}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        initialIndex={initialIndex}
      />{" "}
      {currentUser?.id === user?.$id && (
        <>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="cover"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="cover"
            className="cursor-pointer shad-button_primary hover:shad-button_ghost absolute bottom-4 right-4 rounded-2xl"
          >
            <IoCamera
              size={40}
              className="text-gray-600 p-2 rounded-2xl font-semibold hover:shad-button_primary shad-button_ghost transition-[background] 0.5s ease-in-out"
            />
          </label>
        </>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white p-8 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crop Cover Image</DialogTitle>
          </DialogHeader>
          {tempImage && (
            <div className="w-full overflow-auto">
              <div className="min-h-full flex items-center justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={16 / 9}
                  className="w-full"
                >
                  <img
                    ref={imageRef}
                    src={tempImage || "/assets/images/gray-texture.jpg"}
                    alt="Temp"
                    className="max-h-[60vh] w-full object-contain"
                  />
                </ReactCrop>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="shad-button_primary hover:shad-button_ghost flex gap-2"
            >
              <p>Save</p>
              {isChangingCoverImage && <div className="animate-spin">⚽</div>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverImage;
