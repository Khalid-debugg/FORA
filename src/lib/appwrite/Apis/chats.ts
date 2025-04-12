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
      ],
    );
    if (!chats) throw new Error("Something went wrong");
    return chats.documents;
  } catch (err) {
    console.log(err);
  }
}
