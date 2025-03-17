import { Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

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
      friendShipId: friendShip.documents[0].$id,
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
