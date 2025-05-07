import { Query, ID } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { createNotification } from "./notifications";

export const checkIsFriend = async (userId: string, friendId: string) => {
  try {
    const friendShip = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.friendShipID,
      [
        Query.or([
          Query.and([
            Query.equal("actor", userId),
            Query.equal("receiver", friendId),
          ]),
          Query.and([
            Query.equal("actor", friendId),
            Query.equal("receiver", userId),
          ]),
        ]),
      ],
    );
    if (!friendShip) throw new Error("Something went wrong!!");
    return {
      isFriend: friendShip.documents.length > 0,
      friendShipId: friendShip.documents[0]?.$id,
    };
  } catch (error) {
    console.log(error.message);
  }
};
export const unFriend = async (friendShipId: string) => {
  try {
    const deletedFriendShip = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.friendShipID,
      friendShipId,
    );
    if (!deletedFriendShip) throw new Error("Something went wrong!!");
    return deletedFriendShip;
  } catch (error) {
    console.log(error.message);
  }
};

export const getFriends = async (userId: string) => {
  try {
    const friendships = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.friendShipID,
      [
        Query.or([
          Query.equal("actor", userId),
          Query.equal("receiver", userId),
        ]),
      ],
    );
    const friendsDocs = friendships.documents.map((friendship) => {
      if (friendship.actor.$id === userId) {
        return friendship.receiver;
      } else {
        return friendship.actor;
      }
    });

    if (!friendsDocs) throw new Error("Something went wrong!!");
    return friendsDocs;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};
export async function addFriend(user: any, friendId: string) {
  try {
    const friendShip = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.friendShipID,
      ID.unique(),
      {
        actor: user.id,
        receiver: friendId,
      },
    );
    if (!friendShip) throw new Error("Something went wrong!!");
    await createNotification({
      senderId: user.id,
      senderName: user.name,
      senderImageUrl: user.imageUrl,
      receiverId: friendId,
      type: "STATUS",
      message: `${user.name} accepted your friend request`,
    });
    return friendShip;
  } catch (err) {
    console.log(err);
  }
}
