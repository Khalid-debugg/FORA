import { ID, Models } from "appwrite";
import { appwriteConfig, storage } from "../config";

export async function handleFileOperation(
  operation: Function,
  fileOrFiles?: File | Models.File | File[] | Models.File[],
) {
  if (!fileOrFiles) return null;

  try {
    return await operation(fileOrFiles);
  } catch (err) {
    console.error("File operation failed:", err);
    throw err;
  }
}

export async function uploadFiles(fileOrFiles?: File | File[]) {
  if (!fileOrFiles) return null;
  try {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    const uploadedFiles = await Promise.all(
      files.map((file) =>
        storage.createFile(appwriteConfig.storageID, ID.unique(), file),
      ),
    );
    if (uploadedFiles.some((file) => !file))
      throw new Error("File upload failed.");
    return Array.isArray(fileOrFiles) ? uploadedFiles : uploadedFiles[0];
  } catch (err) {
    console.error("Error uploading files:", err);
    throw err;
  }
}

export async function deleteFiles(fileOrFiles?: Models.File | Models.File[]) {
  if (!fileOrFiles) return null;
  try {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    await Promise.all(
      files.map((file) =>
        storage.deleteFile(appwriteConfig.storageID, file.$id),
      ),
    );
    return { status: "ok" };
  } catch (err) {
    console.error("Error deleting files:", err);
    throw err;
  }
}

export async function getFilePreview(
  fileOrFiles?: Models.File | Models.File[],
) {
  if (!fileOrFiles) return null;
  try {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    const fileUrls = files.map((file) =>
      storage.getFileView(appwriteConfig.storageID, file.$id),
    );
    return Array.isArray(fileOrFiles) ? fileUrls : fileUrls[0];
  } catch (err) {
    console.error("Error getting file preview:", err);
    throw err;
  }
}
