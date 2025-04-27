import { ID, Query } from "appwrite";
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
export async function getChat(chatId: string) {
  try {
    const chat = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      chatId,
    );
    if (!chat) throw new Error("Something went wrong");
    return chat;
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
export async function getChatId(userId: string, friendId: string) {
  try {
    const chat = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      [
        Query.and([
          Query.contains("participantsIds", userId),
          Query.contains("participantsIds", friendId),
        ]),
      ],
    );
    if (!chat) throw new Error("Something went wrong");

    const theirChat = chat.documents.find(
      (doc) => doc.participants.length === 2,
    );
    if (theirChat) return theirChat.$id;
    else return getNewChatId(userId, friendId);
  } catch (err) {
    console.log(err);
  }
}
export async function getNewChatId(userId: string, friendId: string) {
  console.log(userId, friendId);

  try {
    const newChat = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      ID.unique(),
      {
        participants: [userId, friendId],
        participantsIds: [userId, friendId],
      },
    );
    if (!newChat) throw new Error("Something went wrong");
    return newChat.$id;
  } catch (err) {
    console.log(err);
  }
}
export async function makeChatRead(chatId: string, userId: string) {
  try {
    if (!chatId) return;
    const chat = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.chatsID,
      chatId,
    );
    if (!chat) throw new Error("Something went wrong");
    const readMessages = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.messagesID,
      chat.lastMessage.$id,
      {
        readBy: [...chat.lastMessage.readBy, userId],
      },
    );
    return readMessages;
  } catch (err) {
    console.log(err);
  }
}
