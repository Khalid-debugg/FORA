import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  storageID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  databaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  gamesID: import.meta.env.VITE_APPWRITE_GAMES_ID,
  joinedGamesID: import.meta.env.VITE_APPWRITE_JOINED_GAMES_ID,
  waitingGamesID: import.meta.env.VITE_APPWRITE_WAITING_GAMES_ID,
  usersID: import.meta.env.VITE_APPWRITE_USERS_ID,
  postsID: import.meta.env.VITE_APPWRITE_POSTS_ID,
  commentsID: import.meta.env.VITE_APPWRITE_COMMENTS_ID,
  repliesID: import.meta.env.VITE_APPWRITE_REPLIES_ID,
  mediaBucketID: import.meta.env.VITE_APPWRITE_MEDIA_BUCKET_ID,
  friendShipID: import.meta.env.VITE_APPWRITE_FRIENDSHIP_ID,
  notificationsID: import.meta.env.VITE_APPWRITE_NOTIFICATIONS_ID,
  chatsID: import.meta.env.VITE_APPWRITE_CHATS_ID,
  messagesID: import.meta.env.VITE_APPWRITE_MESSAGES_ID,
};
export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
