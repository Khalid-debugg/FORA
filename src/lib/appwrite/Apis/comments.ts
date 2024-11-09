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
export async function likeComment(comment: INewComment, userId: string) {
  try {
    const currentLikes = comment?.commentLikes?.map((like) => like.$id) || [];
    console.log([...currentLikes, userId]);

    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      comment?.$id,
      {
        commentLikes: [...currentLikes, userId],
      },
    );

    if (!updatedComment) {
      return new Error("Failed to like the comment.");
    }

    return updatedComment;
  } catch (err) {
    console.error("Error creating like:", err);
    throw err;
  }
}
export async function unlikeComment(comment: INewComment, userId: string) {
  try {
    const currentLikes = comment?.commentLikes?.map((like) => like.$id);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      comment.$id,
      {
        commentLikes: currentLikes.filter((like) => like !== userId) || [],
      },
    );

    if (!updatedPost) {
      return new Error("Failed to dislike the comment.");
    }

    return updatedPost;
  } catch (err) {
    console.error("Error creating like:", err);
    throw err;
  }
}
