import { ID } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { Query } from "appwrite";
export const sendFriendRequest = async (
  userId: string,
  userName: string,
  friendId: string,
) => {
  try {
    const friendRequest = databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      ID.unique(),
      {
        user: friendId,
        actor: userId,
        type: "friendRequest",
        content: `${userName} sent you a friend request`,
      },
    );
    if (!friendRequest) throw new Error("Something went wrong!!");
    return friendRequest;
  } catch (error) {
    console.log(error.message);
  }
};
export const removeFriendRequest = async (userId: string, friendId: string) => {
  try {
    const friendRequest = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [
        Query.equal("user", friendId),
        Query.equal("type", "friendRequest"),
        Query.equal("actor", userId),
      ],
    );
    if (!friendRequest) throw new Error("Something went wrong!!");
    const deletedRequest = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      friendRequest?.documents[0].$id,
    );
    if (!deletedRequest) throw new Error("Something went wrong!!");
    return deletedRequest;
  } catch (error) {
    console.log(error.message);
  }
};
export const getNotifications = async (userId: string) => {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [Query.equal("user", userId)],
    );
    if (!notifications) throw new Error("Something went wrong!!");
    return notifications?.documents;
  } catch (error) {
    console.log(error.message);
  }
};
export const checkIsFriendRequestSent = async (
  userId: string,
  friendId: string,
) => {
  try {
    const friendShip = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [
        Query.and([
          Query.equal("type", "friendRequest"),
          Query.equal("user", friendId),
          Query.equal("actor", userId),
        ]),
      ],
    );
    if (!friendShip) throw new Error("Something went wrong!!");
    return friendShip.documents.length > 0;
  } catch (error) {
    console.log(error.message);
  }
};
