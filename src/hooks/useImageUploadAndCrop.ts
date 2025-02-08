import { useState, useRef, useCallback } from "react";
import { Crop } from "react-image-crop";
import { toast } from "@/components/ui/use-toast";
import { processImage } from "@/_root/utils/imageUtils";
import { Models } from "appwrite";

export const useImageUploadAndCrop = (
  uploadFunction: (file: File) => Promise<Models.Document>,
  defaultImage: string,
) => {
  const [image, setImage] = useState<string>(defaultImage);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileRef.current = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setTempImage(e.target.result as string);
          setIsDialogOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = useCallback(async () => {
    if (tempImage && crop && imageRef.current && fileRef.current) {
      try {
        const file = await processImage(imageRef.current, crop);
        setImage(URL.createObjectURL(file));
        await uploadFunction(file);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Image updated successfully",
        });
      } catch (err) {
        toast({
          variant: "error",
          title: "Oops",
          description: "Something went wrong",
        });
      }
      setTempImage(null);
    }
  }, [uploadFunction, crop, tempImage]);

  return {
    image,
    tempImage,
    crop,
    isDialogOpen,
    imageRef,
    setCrop,
    setIsDialogOpen,
    handleImageUpload,
    handleSave,
  };
};
