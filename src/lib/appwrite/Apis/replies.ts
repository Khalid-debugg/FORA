import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { INewReply } from "@/types";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";
export async function getReplies(commentId: string, pageParam: number) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.repliesID,
      [
        Query.equal("comment", commentId),
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
export async function createReply(reply: INewReply) {
  try {
    const uploadedFile = await handleFileOperation(uploadFiles, reply.media);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);

    const newReply = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.repliesID,
      ID.unique(),
      {
        creator: reply.userId,
        content: reply.reply,
        comment: reply.commentId,
        mediaUrl: fileUrl,
        mediaId: uploadedFile?.$id || null,
      },
    );

    if (!newReply) {
      await handleFileOperation(deleteFiles, uploadedFile);
      throw new Error("Failed to create the comment.");
    }

    return newReply;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
}
