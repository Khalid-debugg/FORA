import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { INewComment } from "@/types";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";
import { createNotification, deleteNotification } from "./notifications";

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
export async function createComment(sender, post, values) {
  try {
    const uploadedFile = await handleFileOperation(uploadFiles, values.media);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);

    const newComment = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      ID.unique(),
      {
        creator: sender.id,
        content: values.comment,
        post: post.$id,
        mediaUrl: fileUrl,
        mediaId: uploadedFile?.$id || null,
      },
    );
    if (!newComment) {
      await handleFileOperation(deleteFiles, uploadedFile);
      throw new Error("Failed to create the comment.");
    }
    await createNotification({
      type: "COMMENT",
      senderId: sender.id,
      senderName: sender.name,
      senderImageUrl: sender.imageUrl,
      receiverId: post.creator.$id,
      postId: post.$id,
      message: `${sender.name.split(" ")[0]} commented on your post`,
    });
    return newComment;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
}
export async function likeComment(sender: any, comment: INewComment) {
  const id = comment.$id + "-" + sender.id.slice(0, 10);
  try {
    const likedComment = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.LikesID,
      id,
      {
        userId: sender.id,
        userName: sender.name,
        userImageUrl: sender.imageUrl,
        postId: comment.post.$id,
      },
    );
    if (comment.creator.$id !== sender.id) {
      await createNotification({
        type: "LIKE_COMMENT",
        senderId: sender.id,
        receiverId: comment.creator.$id,
        senderImageUrl: sender.imageUrl,
        senderName: sender.name,
        postId: comment.post.$id,
        message: `${sender.name.split(" ")[0]} liked your comment`,
      });
    }

    return likedComment;
  } catch (err) {
    console.log(err);
  }
}
export async function unlikeComment(sender: any, comment: INewComment) {
  const id = comment.$id + "-" + sender.id.slice(0, 10);
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.LikesID,
      id,
    );
    if (comment.creator.$id !== sender.id) {
      await deleteNotification({
        type: "LIKE_COMMENT",
        senderId: sender.id,
        senderName: sender.name,
        senderImageUrl: sender.imageUrl,
        receiverId: comment.creator.$id,
        postId: comment.post.$id,
        message: `${sender.name.split(" ")[0]} liked your post`,
      });
    }
    return { success: true };
  } catch (err) {
    console.error("Error unliking post:", err);
    throw err;
  }
}
export async function editComment(
  id: string,
  content: string,
  file: File | null,
  mediaUrl: string,
  mediaId: string,
) {
  try {
    const newUploadedFile = file
      ? await handleFileOperation(uploadFiles, file)
      : null;
    const newFilesUrl = file
      ? await handleFileOperation(getFilePreview, newUploadedFile)
      : null;
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      id,
      {
        content: content,
        mediaUrl: mediaUrl || newFilesUrl || null,
        mediaId: newUploadedFile?.$id || mediaId || null,
      },
    );
    if (!updatedComment) throw new Error("Comment not found");
    return updatedComment;
  } catch (err) {
    console.log(err);
  }
}
export async function deleteComment(sender, comment) {
  try {
    const deletedComment = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      comment.$id,
    );
    if (!deletedComment) throw new Error("Comment not found");
    await deleteNotification({
      type: "COMMENT",
      senderId: comment.creator.$id,
      senderName: comment.creator.name,
      senderImageUrl: comment.creator.imageUrl,
      receiverId: comment.post.creator.$id,
      postId: comment.post.$id,
      message: `${comment.creator.name.split(" ")[0]} commented on your post`,
    });
    return deletedComment;
  } catch (err) {
    console.log(err);
  }
}
