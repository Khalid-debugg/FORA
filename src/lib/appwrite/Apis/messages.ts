import { Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

export const hasNewMessages = async (userId: string) => {
  try {
    const chats = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      [Query.equal("participantsIds", userId)],
    );
    console.log(chats);

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
