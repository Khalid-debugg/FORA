import { ID } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { Query } from "appwrite";
import { INotification } from "@/types";

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
        sender: friendId,
        receiver: userId,
        type: "FRIEND_REQUEST",
        message: `${userName} sent you a friend request`,
      },
    );
    if (!friendRequest) throw new Error("Something went wrong!!");
    return friendRequest;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const removeFriendRequest = async (userId: string, friendId: string) => {
  try {
    const friendRequest = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [
        Query.equal("sender", friendId),
        Query.equal("type", "FRIEND_REQUEST"),
        Query.equal("receiver", userId),
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
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
          Query.equal("type", "FRIEND_REQUEST"),
          Query.equal("sender", friendId),
          Query.equal("receiver", userId),
        ]),
      ],
    );
    if (!friendShip) throw new Error("Something went wrong!!");
    return friendShip.documents.length > 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return false;
  }
};

export async function createNotification({
  type,
  sender,
  receiver,
  post,
  game,
  comment,
  reply,
  message,
}: Omit<INotification, "$id" | "$createdAt" | "isRead">) {
  try {
    const notification = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      ID.unique(),
      {
        type,
        sender,
        receiver,
        post,
        game,
        comment,
        reply,
        message,
        isRead: false,
      },
    );
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function getNotifications(userId: string) {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [Query.equal("receiver", userId), Query.orderDesc("$createdAt")],
    );
    return notifications.documents;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching notifications:", error.message);
    }
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      notificationId,
      {
        isRead: true,
      },
    );
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [Query.equal("receiver", userId), Query.equal("isRead", false)],
    );

    const updatePromises = notifications.documents.map((doc) =>
      databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.notificationsID,
        doc.$id,
        {
          isRead: true,
        },
      ),
    );

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      notificationId,
    );
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}
