import { ID } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { Query } from "appwrite";
import { INotification } from "@/types";

export const sendFriendRequest = async (user: any, friend: any) => {
  try {
    const friendRequest = databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      ID.unique(),
      {
        senderId: user.id,
        senderName: user.name,
        senderImageUrl: user.imageUrl,
        receiverId: friend.$id,
        type: "FRIEND_REQUEST",
        message: `${user.name} sent you a friend request`,
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

export const removeFriendRequest = async (
  userId: string,
  friendId: string,
  notificationId?: string,
) => {
  try {
    if (notificationId) {
      const deletedRequest = await databases.deleteDocument(
        appwriteConfig.databaseID,
        appwriteConfig.notificationsID,
        notificationId,
      );
      if (!deletedRequest) throw new Error("Something went wrong!!");
      return deletedRequest;
    }
    const friendRequest = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [
        Query.equal("senderId", friendId),
        Query.equal("type", "FRIEND_REQUEST"),
        Query.equal("receiverId", userId),
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
  console.log(userId, friendId);

  try {
    const friendShip = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [
        Query.and([
          Query.equal("type", "FRIEND_REQUEST"),
          Query.equal("senderId", userId),
          Query.equal("receiverId", friendId),
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
  senderId,
  senderName,
  senderImageUrl,
  receiverId,
  postId,
  gameId,
  message,
}: Omit<INotification, "$id" | "$createdAt" | "isRead">) {
  try {
    const notification = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      ID.unique(),
      {
        type,
        senderId,
        senderName,
        senderImageUrl,
        receiverId,
        postId,
        gameId,
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
      [Query.equal("receiverId", userId), Query.orderDesc("$createdAt")],
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
      [Query.equal("receiverId", userId), Query.equal("isRead", false)],
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
export const hasNewNotifications = async (userId: string) => {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      [Query.equal("receiverId", userId), Query.equal("isRead", false)],
    );
    if (!notifications) throw new Error("Something went wrong!!");
    return notifications.documents.length > 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return false;
  }
};
