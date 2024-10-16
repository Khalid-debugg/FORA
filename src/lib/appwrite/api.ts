import {
  ICreatedPost,
  INewComment,
  INewGame,
  INewPost,
  INewReply,
  INewUser,
  IRegisteredUser,
} from "@/types";
import { ID, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { log } from "node:console";

export async function createUserAccount(user: INewUser) {
  try {
    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
    );
    if (!newUser) throw new Error();
    const avatarURL = avatars.getInitials(
      user.username,
      undefined,
      undefined,
      "30cc42",
    );
    return await createUserInDB({
      accountID: newUser.$id,
      email: user.email,
      username: user.username,
      imageURL: avatarURL,
    });
  } catch (error) {
    return error;
  }
}

export async function createUserInDB(user: {
  accountID: string;
  email: string;
  username: string;
  imageURL: URL;
}) {
  try {
    const document = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      ID.unique(),
      user,
    );
    return document;
  } catch (err) {
    return err;
  }
}
export async function createLoginSession(user: IRegisteredUser) {
  try {
    const newUser = await account.createEmailSession(user.email, user.password);
    return newUser;
  } catch (err) {
    return err;
  }
}
export async function deleteSession() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (err) {
    return err;
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      [Query.equal("accountID", currentAccount.$id)],
    );
    if (!currentUser) throw new Error();
    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
}
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
export async function getGame(postId: string) {
  try {
    const normalPost = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      postId,
    );
    if (!normalPost) throw new Error("Game not found");
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

export async function createGame(post: INewGame) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        playersNumber: post.playersNumber,
        location:
          post.governorate + " - " + post.city + " - " + post.playgroundName,
        date: post.dateTime.replace("T", " | "),
      },
    );
    if (!newPost) {
      throw new Error();
    }
    const newWaitingList = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      ID.unique(),
      {
        gameId: newPost.$id,
        waitingPlayers: [],
      },
    );
    if (!newWaitingList) {
      throw new Error();
    }
    const newJoinedList = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      ID.unique(),
      {
        gameId: newPost.$id,
        joinedPlayers: [],
      },
    );
    if (!newJoinedList) {
      throw new Error();
    }
    return newPost;
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
async function handleFileOperation(
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

export async function leaveGame({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  try {
    const waitingGame = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", [postId])],
    );
    if (
      !waitingGame.documents[0].waitingPlayers.some(
        (player) => player.$id === userId,
      )
    ) {
      return new Error("Already left the game");
    }
    const waitingPlayers = waitingGame.documents[0].waitingPlayers.filter(
      (player) => player.$id !== userId,
    );
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGame.documents[0].$id,
      {
        waitingPlayers,
      },
    );
    if (!updatedPost) return new Error();
    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}
export async function joinGame({
  userId,
  postId,
  playersNumber,
}: {
  userId: string;
  postId: string;
  playersNumber: number;
}) {
  try {
    const waitingGame = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", [postId])],
    );

    const waitingPlayers = waitingGame.documents[0].waitingPlayers;
    if (waitingPlayers.length === playersNumber)
      return new Error("Game is full");
    if (!waitingPlayers.some((player) => player.$id === userId)) {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.waitingGamesID,
        waitingGame.documents[0].$id,
        {
          waitingPlayers: [...waitingPlayers, userId],
        },
      );
      return updatedPost;
    } else {
      return new Error("Already joined the game");
    }
  } catch (err) {
    console.log(err);
  }
}
export async function likePost(post: ICreatedPost, userId: string) {
  try {
    const currentLikes = post?.likes.map((like) => like.$id) || [];
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      post.$id,
      {
        likes: [...currentLikes, userId],
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
    const currentLikes = post?.likes.map((like) => like.$id);
    console.log(currentLikes);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      post.$id,
      {
        likes: currentLikes.filter((like) => like !== userId) || [],
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
export async function likeComment(comment: INewComment, userId: string) {
  try {
    const currentLikes = comment?.likes?.map((like) => like.$id) || [];
    console.log([...currentLikes, userId]);

    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      comment?.$id,
      {
        likes: [...currentLikes, userId],
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
    const currentLikes = comment?.likes.map((like) => like.$id);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsID,
      comment.$id,
      {
        likes: currentLikes.filter((like) => like !== userId) || [],
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
// export async function verifyUser() {
//   try {
//     const promise = await account.createVerification(
//       "http://localhost:5173/verify",
//     );
//     return promise;
//   } catch (err) {
//     console.log(err);
//   }
// }
// export async function updateUserVerification(userId: string, secret: string) {
//   try {
//     const promise = account.updateVerification(userId, secret);
//     return promise;
//   } catch (err) {
//     console.log(err);
//   }
// }
export async function getWaitingPlayers(gameId: string) {
  try {
    const game = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!game) throw new Error();
    return game.documents[0].waitingPlayers;
  } catch (err) {
    console.log(err);
  }
}
export async function getJoinedPlayers(gameId: string) {
  try {
    const game = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!game) throw new Error();
    return game.documents[0].joinedPlayers;
  } catch (err) {
    console.log(err);
  }
}
