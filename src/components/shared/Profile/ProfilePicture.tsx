import { useImageUploadAndCrop } from "@/hooks/useImageUploadAndCrop";
import { useChangeProfilePicture } from "@/lib/react-query/queriesAndMutations/Profile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoCamera } from "react-icons/io5";
import ReactCrop from "react-image-crop";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";

const ProfilePicture = ({ user }) => {
  const {
    mutateAsync: changeProfilePicture,
    isPending: isChangingProfilePicture,
  } = useChangeProfilePicture();

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
    async (file) => changeProfilePicture({ file, userId: user?.$id }),
    user?.imageUrl || "",
  );

  return (
    <div className="absolute -top-16 left-4 border-4 border-white rounded-full bg-white">
      <img
        src={image}
        alt="Profile Picture"
        width={128}
        height={128}
        className="rounded-full"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="image"
        className="cursor-pointer shad-button_primary hover:shad-button_ghost absolute bottom-0 right-0 rounded-2xl"
      >
        <IoCamera
          size={40}
          className="text-gray-600 p-2 rounded-2xl font-semibold hover:shad-button_primary shad-button_ghost transition-[background] 0.5s ease-in-out"
        />
      </label>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white p-8">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          {tempImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={imageRef}
                src={tempImage || "/placeholder.svg"}
                alt="Temp"
              />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="shad-button_primary hover:shad-button_ghost flex gap-2"
            >
              <p>Save</p>
              {isChangingProfilePicture && (
                <div className="animate-spin">⚽</div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePicture;
