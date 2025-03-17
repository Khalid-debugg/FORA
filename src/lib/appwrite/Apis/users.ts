import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "../config";
import { INewUser, IRegisteredUser } from "@/types";

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
      name: user.firstName + user.lastName,
      accountID: newUser.$id,
      email: user.email,
      username: user.username,
      imageUrl: avatarURL,
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
