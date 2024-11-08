import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { INewComment } from "@/types";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";

export async function getComments(postId: string, pageParam: number) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      [
        Query.equal("post", postId),
        Query.limit(5),
        Query.offset(pageParam * 5),
        Query.orderDesc("$createdAt"),
      ],
    );

    if (!comments) throw new Error("Something went wrong");
    return comments.documents;
  } catch (err) {
    console.log(err);
  }
}
export async function createComment(comment: INewComment) {
  try {
    const uploadedFile = await handleFileOperation(uploadFiles, comment.media);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);

    const newComment = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      ID.unique(),
      {
        creator: comment.userId,
        content: comment.comment,
        post: comment.postId,
        mediaUrl: fileUrl,
        mediaId: uploadedFile?.$id || null,
      },
    );

    if (!newComment) {
      await handleFileOperation(deleteFiles, uploadedFile);
      throw new Error("Failed to create the comment.");
    }

    return newComment;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
}
