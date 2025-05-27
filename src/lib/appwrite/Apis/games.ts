import { INewGame } from "@/types";
import { appwriteConfig, databases } from "../config";
import { ID, Query } from "appwrite";
import { createNotification } from "./notifications";

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

export async function getRecentGames(pageParam: number, userId: string) {
  try {
    const games = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      [
        Query.equal("creator", userId),
        Query.limit(10),
        Query.offset(pageParam * 10),
        Query.orderDesc("$createdAt"),
      ],
    );

    return games.documents;
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
          post.governorate +
          (post.city ? " - " + post.city : "") +
          (post.playgroundName ? " - " + post.playgroundName : ""),

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
  game,
  waitingGame,
  user,
}: {
  game: any;
  waitingGame: any;
  user: any;
}) {
  try {
    await createNotification({
      type: "JOIN_GAME_REQUEST",
      senderId: user.id,
      senderName: user.name,
      senderImageUrl: user.imageUrl,
      receiverId: game.creator.$id,
      gameId: game.$id,
      message: `${user.name.split(" ")[0]} wants to join your game`,
    });
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGame.$id,
      {
        waitingPlayers: [
          ...waitingGame.waitingPlayers.map((player) => player.$id),
          user.id,
        ],
      },
    );
    if (!updatedWaitingGame) return new Error();
    return updatedWaitingGame;
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
    if (!game || game.documents.length === 0) {
      return {
        $id: gameId,
        waitingPlayers: [],
        gameId: gameId,
      };
    }
    return game.documents[0];
  } catch (err) {
    console.log(err);
    return {
      $id: gameId,
      waitingPlayers: [],
      gameId: gameId,
    };
  }
}

export async function getJoinedGame(gameId: string) {
  try {
    const game = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      [Query.equal("gameId", gameId)],
    );
    if (!game || game.documents.length === 0) {
      return {
        $id: gameId,
        joinedPlayers: [],
        gameId: gameId,
      };
    }
    return game.documents[0];
  } catch (err) {
    console.log(err);
    return {
      $id: gameId,
      joinedPlayers: [],
      gameId: gameId,
    };
  }
}

export async function rejectPlayer({
  user,
  waitingGame,
}: {
  user: any;
  waitingGame: any;
}) {
  try {
    if (!waitingGame.waitingPlayers.some((player) => player.$id === user.$id))
      return new Error("Player is not in the waiting list anymore");
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGame.$id,
      {
        waitingPlayers: waitingGame.waitingPlayers
          .filter((player) => player.$id !== user.$id)
          .map((player) => player.$id),
      },
    );
    if (!updatedWaitingGame) throw new Error();
    await createNotification({
      type: "STATUS",
      sender: user.$id,
      post: undefined,
      receiver: waitingGame.game.creator.$id,
      game: waitingGame.game.$id,
      message: `${user.name} has rejected your join request`,
    });
    return updatedWaitingGame;
  } catch (err) {
    console.log(err);
  }
}

export async function acceptPlayer({
  game,
  joinedGame,
  waitingGame,
  user,
}: {
  game: any;
  joinedGame: any;
  waitingGame: any;
  user: any;
}) {
  try {
    const updatedWaitingGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.waitingGamesID,
      waitingGame.$id,
      {
        waitingPlayers: waitingGame.waitingPlayers
          .filter((player) => player.$id !== user.$id)
          .map((player) => player.$id),
      },
    );
    if (!updatedWaitingGame) throw new Error();
    const updateJoinedGame = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.joinedGamesID,
      joinedGame.$id,
      {
        joinedPlayers: [
          ...joinedGame.joinedPlayers.map((player) => player.$id),
          user.$id,
        ],
      },
    );
    if (!updateJoinedGame) throw new Error();

    const newNotification = await createNotification({
      type: "STATUS",
      senderId: game.creator.$id,
      senderName: game.creator.name,
      senderImageUrl: game.creator.imageUrl,
      receiverId: user.$id,
      gameId: game.$id,
      message: `Your request to join the game has been accepted`,
    });

    return newNotification;
  } catch (err) {
    console.log(err);
  }
}
export async function getGamesNearby(pageParam: number, user: any) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.gamesID,
      [
        Query.limit(5),
        Query.offset(pageParam * 5),
        Query.notEqual("creator", user.id),
        Query.contains("location", user.governorate),
        Query.orderDesc("$createdAt"),
      ],
    );
    console.log(users);

    if (!users) throw new Error();
    return users.documents;
  } catch (err) {
    console.log(err);
  }
}
