import CoverImage from "@/components/shared/Profile/CoverImage";
import { appwriteConfig, databases } from "../config";
import { getFilePreview, handleFileOperation, uploadFiles } from "./helper";
import { Tags } from "lucide-react";
import { ID, Query } from "appwrite";
export async function changeProfilePicture(file: File, userId: string) {
  try {
    const uploadedFile = await handleFileOperation(uploadFiles, file);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);
    const updatedProfile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      userId,
      {
        imageUrl: fileUrl,
      },
    );
    if (!updatedProfile) throw new Error("Something went wrong");
    return updatedProfile;
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    throw err;
  }
}
export async function changeCoverImage(file: File, userId: string) {
  try {
    const uploadedFile = await handleFileOperation(uploadFiles, file);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);
    const updatedProfile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      userId,
      {
        coverUrl: fileUrl,
      },
    );
    if (!updatedProfile) throw new Error("Something went wrong");
    return updatedProfile;
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    throw err;
  }
}
export async function updateProfile(formData, userId) {
  console.log(formData);
  try {
    const updatedProfile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      userId,
      {
        name: formData.name,
        bio: formData.bio,
        tags: formData.tags,
        favPosition: formData.favPosition,
        FifaCard: formData.FifaCard,
      },
    );
    if (!updatedProfile) throw new Error("Something went wrong");
    return updatedProfile;
  } catch (err) {
    console.error("Error updating profile :", err);
    throw err;
  }
}
