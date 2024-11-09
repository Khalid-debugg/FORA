import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";
import { ICreatedPost, INewComment, INewPost } from "@/types";

export async function getNormalPost(postId: string) {
  try {
    const normalPost = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      postId,
    );
    if (!normalPost) throw new Error("Post not found");
    return normalPost;
  } catch (err) {
    console.log(err);
  }
}
export async function deleteNormalPost(id: string) {
  try {
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      id,
    );
    if (!deletedPost) throw new Error("Post not found");
    return deletedPost;
  } catch (err) {
    console.log(err);
  }
}
export async function editNormalPost(
  id: string,
  caption: string,
  newfileOrFiles: File | File[],
  mediaUrls: string[],
  mediaIds: string[],
) {
  try {
    const newUploadedFiles = newfileOrFiles
      ? await handleFileOperation(uploadFiles, newfileOrFiles)
      : [];
    const newFilesUrls = newUploadedFiles
      ? await handleFileOperation(getFilePreview, newUploadedFiles)
      : [];
    const finalMediaUrls = [...mediaUrls, ...newFilesUrls];
    const finalMediaIds = [
      ...mediaIds,
      ...newUploadedFiles.map((file) => file?.$id),
    ];
    const normalPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      id,
      {
        caption: caption,
        media: finalMediaUrls,
        mediaIds: finalMediaIds,
      },
    );
    if (!normalPost) throw new Error("Post not found");
    return normalPost;
  } catch (err) {
    console.log(err);
  }
}
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      [Query.limit(20)],
    );
    if (!posts) throw new Error();
    const games = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      [Query.limit(20)],
    );
    if (!games) throw new Error();

    const allPosts = [...posts.documents, ...games.documents].sort(
      (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt),
    );
    return allPosts;
  } catch (err) {
    console.log(err);
  }
}
export async function createPost(post: INewPost) {
  try {
    const uploadedFiles = await handleFileOperation(
      uploadFiles,
      post.file || [],
    );
    const filesUrls = await handleFileOperation(getFilePreview, uploadedFiles);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        media: filesUrls,
        mediaIds: uploadedFiles.map((file) => file?.$id),
      },
    );

    if (!newPost) {
      await handleFileOperation(deleteFiles, uploadedFiles);
      throw new Error("Failed to create the post.");
    }

    return newPost;
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
}
export async function likePost(post: ICreatedPost, userId: string) {
  try {
    const currentLikes = post?.postLikes?.map((like) => like.$id);
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      post.$id,
      {
        postLikes: [...currentLikes, userId],
      },
    );

    if (!updatedPost) {
      return new Error("Failed to like the post.");
    }

    return updatedPost;
  } catch (err) {
    console.error("Error creating like:", err);
    throw err;
  }
}
export async function unlikePost(post: ICreatedPost, userId: string) {
  try {
    const currentLikes = post?.postLikes?.map((like) => like.$id);
    console.log(currentLikes);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      post.$id,
      {
        postLikes: currentLikes.filter((like) => like !== userId) || [],
      },
    );

    if (!updatedPost) {
      return new Error("Failed to dislike the post.");
    }

    return updatedPost;
  } catch (err) {
    console.error("Error creating like:", err);
    throw err;
  }
}
export async function likeReply(reply, userId) {
  try {
    const currentLikes = reply?.replyLikes?.map((like) => like.$id) || [];
    console.log([...currentLikes, userId]);

    const updatedReply = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.repliesID,
      reply?.$id,
      {
        replyLikes: [...currentLikes, userId],
      },
    );

    if (!updatedReply) {
      return new Error("Failed to like the reply.");
    }

    return updatedReply;
  } catch (err) {
    console.error("Error creating reply:", err);
    throw err;
  }
}
export async function unlikeReply(reply: INewComment, userId: string) {
  try {
    const currentLikes = reply?.replyLikes?.map((like) => like.$id);

    const updatedReply = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.repliesID,
      reply.$id,
      {
        replyLikes: currentLikes.filter((like) => like !== userId) || [],
      },
    );

    if (!updatedReply) {
      return new Error("Failed to dislike the reply.");
    }

    return updatedReply;
  } catch (err) {
    console.error("Error creating reply:", err);
    throw err;
  }
}
