import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";
import { ICreatedPost, INewComment, INewPost, INewReply } from "@/types";
import { createNotification, deleteNotification } from "./notifications";

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
export async function getRecentPostsAndGames(
  pageParam: number,
  friends: any[],
  userId: string,
) {
  try {
    if (!friends) return [];
    const userAndFriedsIds = [userId, ...friends];
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      [
        Query.limit(10),
        Query.equal("creator", userAndFriedsIds),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );

    const games = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      [
        Query.limit(10),
        Query.equal("creator", userAndFriedsIds),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );
    return [...posts.documents, ...games.documents].sort((a, b) => {
      return (
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getRecentPosts(pageParam: number, userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      [
        Query.equal("creator", userId),
        Query.limit(10),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );

    return posts.documents;
  } catch (err) {
    console.log(err);
  }
}
export async function getRecentLikedPosts(pageParam: number, userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      [
        Query.contains("likesIds", userId),
        Query.limit(10),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );

    return posts.documents;
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
export async function likePost(sender: any, post: ICreatedPost) {
  const id = post.$id + "-" + sender.id.slice(0, 10);
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.LikesID,
      id,
      {
        userId: sender.id,
        userName: sender.name,
        userImageUrl: sender.imageUrl,
        postId: post.$id,
      },
    );
    if (post.creator.$id !== sender.id) {
      await createNotification({
        type: "LIKE_POST",
        senderId: sender.id,
        receiverId: post.creator.$id,
        senderImageUrl: sender.imageUrl,
        senderName: sender.name,
        postId: post.$id,
        message: `${sender.name} liked your post`,
      });
    }

    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}
export async function unlikePost(sender: any, post: ICreatedPost) {
  const id = post.$id + "-" + sender.id.slice(0, 10);

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.LikesID,
      id,
    );
    if (post.creator.$id !== sender.id) {
      await deleteNotification({
        type: "LIKE_POST",
        senderId: sender.id,
        senderName: sender.name,
        senderImageUrl: sender.imageUrl,
        receiverId: post.creator.$id,
        postId: post.$id,
        message: `${sender.name} liked your post`,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Error unliking post:", err);
    throw err;
  }
}

export async function likeReply(reply: INewReply, userId: string) {
  try {
    const currentLikes = reply?.replyLikes?.map((like) => like.$id) || [];

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
export async function unlikeReply(reply: INewReply, userId: string) {
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
export async function createComment(post: ICreatedPost, comment: INewComment) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      ID.unique(),
      {
        ...comment,
        postId: post.$id,
      },
    );
    if (post.creator.$id !== comment.userId) {
      await createNotification({
        type: "COMMENT",
        senderId: comment.userId,
        receiverId: post.creator.$id,
        postId: post.$id,
        commentId: newComment.$id,
        message: `${comment.userId} commented on your post`,
        sender: comment.userId,
      });
    }

    return newComment;
  } catch (err) {
    console.log(err);
  }
}
export async function getLikes(pageParam: number, documentId: string) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.LikesID,
      [
        Query.startsWith("$id", documentId),
        Query.limit(10),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );
    console.log(likes.documents);

    return likes.documents;
  } catch (err) {
    console.log(err);
  }
}
