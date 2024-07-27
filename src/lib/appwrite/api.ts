import { INewPost, INewUser, IRegisteredUser } from "@/types";
import { ID, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

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
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      [Query.orderDesc("$createdAt"), Query.limit(20)],
    );
    if (!posts) throw new Error();
    return posts;
  } catch (err) {
    console.log(err);
  }
}
export async function createPost(post: INewPost, postType: string) {
  if (postType === "game") return await createGamePost(post);
  else return await createNormalPost(post);
}
export async function createGamePost(post: INewPost) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        players: post.playersNumber,
        location:
          post.governorate + " - " + post.city + " - " + post.playgroundName,
        privacy: post.privacy,
        isGame: true,
      },
    );
    if (!newPost) {
      throw new Error();
    }
    return newPost;
  } catch (err) {
    console.log(err);
  }
}
export async function createNormalPost(post: INewPost) {
  console.log(post);

  try {
    const uploadedFiles = await uploadFiles(post.file || []);
    if (!uploadedFiles) throw new Error();
    const filesUrls = await getFilePreview(uploadedFiles);

    if (!filesUrls) {
      await deleteFiles(uploadedFiles);
      throw new Error();
    }
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        media: filesUrls,
        mediaIds: uploadedFiles.map((file) => file.$id),
        privacy: post.privacy,
        isGame: false,
      },
    );
    if (!newPost) {
      deleteFiles(uploadedFiles);
      throw new Error();
    }
    return newPost;
  } catch (err) {
    console.log(err);
  }
}
export async function uploadFiles(files: File[]) {
  console.log(files);

  try {
    const uploadedFiles = [];
    for (const file of files) {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageID,
        ID.unique(),
        file,
      );
      if (!uploadedFile) return null;
      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  } catch (err) {
    console.log(err);
  }
}
export async function deleteFiles(files: Models.File[]) {
  try {
    for (const file of files) {
      const deletedFile = await storage.deleteFile(
        appwriteConfig.storageID,
        file.$id,
      );
      if (!deletedFile) throw new Error();
    }
    return { status: "ok" };
  } catch (err) {
    console.log(err);
  }
}
export async function getFilePreview(files: Models.File[]) {
  try {
    const filesURls = [];
    for (const file of files) {
      console.log(files);

      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageID,
        file.$id,
        2000,
        2000,
        "top",
        100,
      );
      if (!fileUrl) return null;
      filesURls.push(fileUrl);
    }
    return filesURls;
  } catch (err) {
    console.log(err);
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
