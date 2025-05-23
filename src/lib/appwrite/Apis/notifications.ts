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
  console.log(userId, friendId, notificationId);

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
        Query.equal("senderId", userId),
        Query.equal("type", "FRIEND_REQUEST"),
        Query.equal("receiverId", friendId),
      ],
    );

    if (!friendRequest) throw new Error("Something went wrong!!");
    const deletedRequest = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      friendRequest?.documents[0]?.$id,
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

export const checkIsFriendRequestReceived = async (
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
          Query.equal("senderId", friendId),
          Query.equal("receiverId", userId),
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
function generateNotificationId({
  type,
  senderId,
  receiverId,
  postId,
  gameId,
}: {
  type: string;
  senderId?: string;
  receiverId: string;
  postId?: string;
  gameId?: string;
}) {
  const shortTypeMap: Record<string, string> = {
    JOIN_GAME_REQUEST: "JG",
    FRIEND_REQUEST: "FR",
    LIKE_POST: "LP",
    LIKE_COMMENT: "LC",
    LIKE_REPLY: "LR",
    COMMENT: "CM",
    REPLY: "RP",
    STATUS: "ST",
  };

  const shortType = shortTypeMap[type] || "XX";

  let data = "";
  if (["JG"].includes(shortType)) data = gameId?.slice(0, 10) || "";
  else if (["FR"].includes(shortType)) data = senderId?.slice(0, 10) || "";
  else if (["LP", "LC", "LR", "CM", "RP"].includes(shortType))
    data = postId?.slice(0, 10) || "";

  const shortReceiver = receiverId.slice(0, 8);

  const rawId = `${shortType}-${data}-${shortReceiver}`;

  return rawId.slice(0, 36);
}
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
  const id = generateNotificationId({
    type,
    senderId,
    receiverId,
    postId,
    gameId,
  });

  try {
    const existing = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      id,
    );
    const updatedSenderId = [...existing.senderId, senderId];
    const updatedSenderName = [...existing.senderName, senderName];
    const firstNames = updatedSenderName.map((full) => full.split(" ")[0]);
    const updatedSenderImageUrl = [...existing.senderImageUrl, senderImageUrl];
    const parts = message.split(" ");
    const action = parts[1];
    const rest = parts.slice(2).join(" ");
    const count = updatedSenderName.length;
    let updatedMessage = "";
    if (count === 1) {
      updatedMessage = `${firstNames[0]} ${action} ${rest}`;
    } else if (count === 2) {
      updatedMessage = `${firstNames[0]} and ${firstNames[1]} ${action} ${rest}`;
    } else {
      updatedMessage = `${firstNames[0]} and ${count - 1} others ${action} ${rest}`;
    }
    const updated = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      id,
      {
        senderId: updatedSenderId,
        senderName: updatedSenderName,
        senderImageUrl: updatedSenderImageUrl,
        message: updatedMessage,
      },
    );
    return updated;
  } catch (error: any) {
    if (error.code === 404) {
      const notification = await databases.createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.notificationsID,
        id,
        {
          type,
          senderId: [senderId],
          senderName: [senderName],
          senderImageUrl: [senderImageUrl],
          receiverId,
          postId,
          gameId,
          message: message,
          isRead: false,
        },
      );
      return notification;
    }

    console.error("Error handling notification:", error);
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

export async function deleteNotification({
  type,
  senderId,
  senderName,
  senderImageUrl,
  receiverId,
  postId,
  gameId,
  message,
}: {
  type: INotification["type"];
  senderId: string;
  senderName: string;
  senderImageUrl: string;
  receiverId: string;
  postId?: string;
  gameId?: string;
  message: string;
}) {
  const id = generateNotificationId({
    type,
    senderId,
    receiverId,
    postId,
    gameId,
  });

  try {
    const existing = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      id,
    );

    const updatedSenderId = existing.senderId.filter(
      (id: string) => id !== senderId,
    );
    const updatedSenderName = existing.senderName.filter(
      (name: string) => name !== senderName,
    );
    const updatedSenderImageUrl = existing.senderImageUrl.filter(
      (url: string) => url !== senderImageUrl,
    );
    if (updatedSenderId.length === 0) {
      await databases.deleteDocument(
        appwriteConfig.databaseID,
        appwriteConfig.notificationsID,
        id,
      );
      return { deleted: true };
    }

    const firstNames = updatedSenderName.map((full) => full.split(" ")[0]);
    const parts = message.split(" ");
    const action = parts[1];
    const rest = parts.slice(2).join(" ");
    const count = updatedSenderName.length;

    let updatedMessage = "";
    if (count === 1) {
      updatedMessage = `${firstNames[0]} ${action} ${rest}`;
    } else if (count === 2) {
      updatedMessage = `${firstNames[0]} and ${firstNames[1]} ${action} ${rest}`;
    } else {
      updatedMessage = `${firstNames[0]} and ${count - 1} others ${action} ${rest}`;
    }

    const updated = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      id,
      {
        senderId: updatedSenderId,
        senderName: updatedSenderName,
        senderImageUrl: updatedSenderImageUrl,
        message: updatedMessage,
      },
    );

    return updated;
  } catch (error) {
    console.error("Error deleting/updating notification:", error);
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
