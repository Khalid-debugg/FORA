import { INewGame } from "@/types";
import { appwriteConfig, databases } from "../config";
import { ID, Query } from "appwrite";
export async function deleteGame(id: string) {
  try {
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      id,
    );
    if (!deletedPost) throw new Error("Game not found");
    return deletedPost;
  } catch (err) {
    console.log(err);
  }
}
export async function editGamePost(
  emptySpots: number,
  newJoinedPlayers: string[],
  gameId: string,
  joinedGameID: string,
  newLocation: string,
  newDate: string,
) {
  try {
    const totalPLayers = emptySpots + newJoinedPlayers.length;
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      joinedGameID,
      {
        gameId: gameId,
        joinedPlayers: newJoinedPlayers,
      },
    );
    if (!updatedWaitingGame) throw new Error("Game not found");
    const updatedGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      gameId,
      {
        location: newLocation,
        date: newDate,
        playersNumber: totalPLayers,
      },
    );
    if (!updatedGame) throw new Error("Game not found");
    return updatedGame;
  } catch (err) {
    console.log(err);
  }
}
export async function getGame(postId: string) {
  try {
    const normalPost = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      postId,
    );
    if (!normalPost) throw new Error("Game not found");
    return normalPost;
  } catch (err) {
    console.log(err);
  }
}
export async function createGame(post: INewGame) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        playersNumber: post.playersNumber,
        location:
          post.governorate + " - " + post.city + " - " + post.playgroundName,
        date: post.dateTime.replace("T", " | "),
      },
    );
    if (!newPost) {
      throw new Error();
    }
    const newWaitingList = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      ID.unique(),
      {
        gameId: newPost.$id,
        waitingPlayers: [],
      },
    );
    if (!newWaitingList) {
      throw new Error();
    }
    const newJoinedList = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      ID.unique(),
      {
        gameId: newPost.$id,
        joinedPlayers: [],
      },
    );
    if (!newJoinedList) {
      throw new Error();
    }
    return newPost;
  } catch (err) {
    console.log(err);
  }
}
export async function leaveGame({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  try {
    const waitingGame = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", [postId])],
    );
    if (
      !waitingGame.documents[0].waitingPlayers.some(
        (player) => player.$id === userId,
      )
    ) {
      return new Error("Already left the game");
    }
    const waitingPlayers = waitingGame.documents[0].waitingPlayers
      .filter((player) => player.$id !== userId)
      .map((player) => player.$id);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGame.documents[0].$id,
      {
        waitingPlayers,
      },
    );
    if (!updatedPost) return new Error();
    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}
export async function joinGame({
  userId,
  postId,
  playersNumber,
}: {
  userId: string;
  postId: string;
  playersNumber: number;
}) {
  try {
    const waitingGame = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", [postId])],
    );

    const waitingPlayers = waitingGame.documents[0].waitingPlayers;
    if (waitingPlayers.length === playersNumber)
      return new Error("Game is full");
    if (!waitingPlayers.some((player) => player.$id === userId)) {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseID,
        appwriteConfig.waitingGamesID,
        waitingGame.documents[0].$id,
        {
          waitingPlayers: [
            ...waitingPlayers.map((player) => player.$id),
            userId,
          ],
        },
      );
      return updatedPost;
    } else {
      return new Error("Already joined the game");
    }
  } catch (err) {
    console.log(err);
  }
}
export async function getWaitingGame(gameId: string) {
  try {
    const game = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!game) throw new Error();
    return game.documents[0];
  } catch (err) {
    console.log(err);
  }
}

export async function getJoinedGame(gameId: string) {
  try {
    const game = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!game) throw new Error();
    return game.documents[0];
  } catch (err) {
    console.log(err);
  }
}
export async function rejectPlayer({
  waitingGameId,
  userId,
  waitingPlayers,
}: {
  waitingGameId: string;
  userId: string;
  waitingPlayers: any[];
}) {
  try {
    if (!waitingPlayers.some((player) => player.$id === userId))
      return new Error("Player is not in the waiting list anymore");
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGameId,
      {
        waitingPlayers: waitingPlayers
          .filter((player) => player.$id !== userId)
          .map((player) => player.$id),
      },
    );
    if (!updatedWaitingGame) throw new Error();
    return updatedWaitingGame;
  } catch (err) {
    console.log(err);
  }
}
export async function acceptPlayer({
  gameId,
  userId,
  waitingGameId,
  waitingPlayers,
}: {
  userId: string;
  gameId: string;
  waitingGameId: string;
  waitingPlayers: any[];
}) {
  try {
    const joinedGame = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!joinedGame) throw new Error("Joined game not found");
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGameId,
      {
        waitingPlayers: waitingPlayers
          .filter((player) => player.$id !== userId)
          .map((player) => player.$id),
      },
    );
    console.log(
      waitingPlayers
        .filter((player) => player.$id !== userId)
        .map((player) => player.$id),
    );

    if (!updatedWaitingGame) throw new Error("Waiting game not found");
    const updatedJoinedGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      joinedGame.documents[0].$id,
      {
        joinedPlayers: [
          ...joinedGame.documents[0].joinedPlayers.map((player) => player.$id),
          userId,
        ],
      },
    );
    console.log(joinedGame.documents[0].joinedPlayers, userId);

    if (!updatedJoinedGame) throw new Error("Joined game not found");
    return updatedJoinedGame;
  } catch (err) {
    console.log(err);
  }
}