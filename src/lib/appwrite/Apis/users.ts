import { ID, Query } from "appwrite";
import { account, appwriteConfig, databases, storage } from "../config";
import { INewUser, IRegisteredUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
    );
    if (!newUser) throw new Error();
    const initialImage = await storage.getFileView(
      appwriteConfig.mediaBucketID,
      "default-profile-image",
    );
    return await createUserInDB({
      name: user.firstName + " " + user.lastName,
      accountID: newUser.$id,
      email: user.email,
      username: user.username,
      imageUrl: initialImage,
      governorate: user.governorate,
      city: user.city,
    });
  } catch (error) {
    return error;
  }
}
export async function createUserInDB(user: {
  name: string;
  accountID: string;
  email: string;
  username: string;
  imageUrl: URL;
  governorate: string;
  city: string;
}) {
  try {
    const uniqueUserId = ID.unique();
    const document = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      uniqueUserId,
      user,
    );
    if (!document) throw new Error("Something went wrong");
    return document;
  } catch (err) {
    return err;
  }
}
export async function createLoginSession(user: IRegisteredUser) {
  try {
    const newUser = await account.createEmailPasswordSession(
      user.email,
      user.password,
    );
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
export async function getUser(id: string) {
  try {
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      [Query.equal("$id", id)],
    );
    if (!currentUser) throw new Error();
    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
}
export async function getUsersYouMayKnow(
  pageParam: number,
  user: any,
  friends: any[],
) {
  const userAndFriendsIds = [user.id, ...friends.map((friend) => friend.id)];
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersID,
      [
        Query.limit(5),
        Query.offset(pageParam * 5),
        Query.equal("governorate", user.governorate),
        Query.orderDesc("$createdAt"),
      ],
    );
    if (!users) throw new Error();
    return users.documents.filter((u) => !userAndFriendsIds.includes(u.$id));
  } catch (err) {
    console.log(err);
  }
}
export async function createRecovery(email: string) {
  try {
    const recovery = await account.createRecovery(
      email,
      `${import.meta.env.VITE_DOMAIN}/set-new-password`,
    );
    return recovery;
  } catch (err) {
    return err;
  }
}
export async function updateRecovery(
  userId: string,
  secret: string,
  newPassword: string,
) {
  try {
    const recovery = await account.updateRecovery(userId, secret, newPassword);
    return recovery;
  } catch (err) {
    return err;
  }
}
export async function createLoginSessionWithRecovery(
  userId: string,
  secret: string,
) {
  try {
    const newUserSession = await account.createSession(userId, secret);
    return newUserSession;
  } catch (err) {
    return err;
  }
}
