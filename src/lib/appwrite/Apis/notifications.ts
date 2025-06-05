import { appwriteConfig, databases } from "../config";
import { Query } from "appwrite";
import { INotification } from "@/types";

export const sendFriendRequest = async (user: any, friend: any) => {
  try {
    const friendRequest = await createNotification({
      type: "FRIEND_REQUEST",
      senderId: user.id,
      senderName: user.name,
      senderImageUrl: user.imageUrl,
      receiverId: friend.$id,
      message: `${user.name.split(" ")[0]} sent you a friend request`,
    });
    if (!friendRequest) throw new Error("Something went wrong!!");
    return friendRequest;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const removeFriendRequest = async (user: any, friend: any) => {
  try {
    const deletedRequest = await deleteNotification({
      type: "FRIEND_REQUEST",
      senderId: user.id,
      senderName: user.name,
      senderImageUrl: user.imageUrl,
      receiverId: friend.$id,
      message: `${user.name} sent you a friend request`,
    });
    if (!deletedRequest) throw new Error("Something went wrong!!");
    return deletedRequest;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const checkIsFriendRequestSent = async (user: any, friend: any) => {
  try {
    const notificationId = await generateNotificationId({
      type: "FRIEND_REQUEST",
      senderId: user.id,
      senderName: user.name,
      senderImageUrl: user.imageUrl,
      receiverId: friend.$id,
      message: "",
    });
    const notification = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      notificationId,
    );
    if (!notification) return false;
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return false;
  }
};

export const checkIsFriendRequestReceived = async (user: any, friend: any) => {
  try {
    const notificationId = await generateNotificationId({
      type: "FRIEND_REQUEST",
      senderId: friend.$id,
      senderName: friend.name,
      senderImageUrl: friend.imageUrl,
      receiverId: user.id,
      message: "",
    });
    const friendShip = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.notificationsID,
      notificationId,
    );
    if (!friendShip) return false;
    return true;
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
    const existingSenderIds = existing.senderId || [];
    const existingSenderNames = existing.senderName || [];
    const existingSenderImageUrls = existing.senderImageUrl || [];

    const updatedSenderId = [...existingSenderIds];
    const updatedSenderName = [...existingSenderNames];
    const updatedSenderImageUrl = [...existingSenderImageUrls];

    if (!existingSenderIds.includes(senderId)) {
      updatedSenderId.push(senderId);
      updatedSenderName.push(senderName.split(" ")[0]);
      updatedSenderImageUrl.push(senderImageUrl);
    }
    const parts = message.split(" ");
    const action = parts[1];
    const rest = parts.slice(2).join(" ");

    const count = updatedSenderName.length;
    let updatedMessage = "";
    if (count === 1) {
      updatedMessage = `${updatedSenderName[0]} ${action} ${rest}`;
    } else if (count === 2) {
      updatedMessage = `${updatedSenderName[0]} and ${updatedSenderName[1]} ${action} ${rest}`;
    } else {
      updatedMessage = `${updatedSenderName[0]} and ${count - 1} others ${action} ${rest}`;
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
          senderName: [senderName.split(" ")[0]],
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
      (name: string) => name !== senderName.split(" ")[0],
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
    const parts = message.split(" ");
    const action = parts[1];
    const rest = parts.slice(2).join(" ");
    const count = updatedSenderName.length;

    let updatedMessage = "";
    if (count === 1) {
      updatedMessage = `${updatedSenderName[0]} ${action} ${rest}`;
    } else if (count === 2) {
      updatedMessage = `${updatedSenderName[0]} and ${updatedSenderName[1]} ${action} ${rest}`;
    } else {
      updatedMessage = `${updatedSenderName[0]} and ${count - 1} others ${action} ${rest}`;
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
