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
export async function getMessages(chatId: string, pageParam: number) {
  try {
    console.log(chatId);

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
