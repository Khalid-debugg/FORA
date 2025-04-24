import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import {
  deleteFiles,
  getFilePreview,
  handleFileOperation,
  uploadFiles,
} from "./helper";

export const hasNewMessages = async (userId: string) => {
  try {
    const chats = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      [Query.equal("participantsIds", userId)],
    );
    if (!chats) throw new Error("Something went wrong!!");

    const newMessages = chats.documents.some((chat) => {
      const readBy = chat.lastMessage?.readBy.map((user) => user.$id) ?? [];
      return !readBy.includes(userId);
    });

    return newMessages;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return false;
  }
};
export async function getMessages(chatId: string, pageParam: number) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.messagesID,
      [
        Query.equal("chat", chatId),
        Query.limit(20),
        Query.offset(pageParam * 20),
        Query.orderDesc("$createdAt"),
      ],
    );
    if (!messages) throw new Error("Something went wrong");
    return messages.documents;
  } catch (err) {
    console.log(err);
  }
}
export async function createMessage({ chatId, message, userId }) {
  console.log(chatId, message, userId);

  try {
    const uploadedFile = await handleFileOperation(uploadFiles, message.media);
    const fileUrl = await handleFileOperation(getFilePreview, uploadedFile);

    const newMessage = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.messagesID,
      ID.unique(),
      {
        sender: userId,
        content: message.content,
        chat: chatId,
        mediaUrl: fileUrl || null,
        mediaId: uploadedFile?.$id || null,
        mediaType: message.media ? message.media.type : null,
      },
    );
    if (!newMessage) {
      await handleFileOperation(deleteFiles, uploadedFile);
      throw new Error("Failed to create the message.");
    }
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      chatId,
      {
        lastMessage: newMessage.$id,
      },
    );
    return updatedChat;
  } catch (err) {
    console.error("Error creating message:", err);
    throw err;
  }
}
