import { Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

export async function getChats(userId: string, pageParam: number) {
  try {
    const chats = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      [
        Query.equal("participantsIds", userId),
        Query.limit(10),
        Query.offset(pageParam * 10),
        Query.orderDesc("$updatedAt"),
        Query.orderDesc("$createdAt"),
      ],
    );
    if (!chats) throw new Error("Something went wrong");
    return chats.documents;
  } catch (err) {
    console.log(err);
  }
}
export async function editChat({ chatId, newChat }) {
  try {
    const chat = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      chatId,
      {
        name: newChat.name,
        participants: newChat.participants?.map((p) => p.$id),
      },
    );
    if (!chat) throw new Error("Something went wrong");
    return chat;
  } catch (err) {
    console.log(err);
  }
}
