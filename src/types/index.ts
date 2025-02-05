export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file?: File[];
};
export type INewComment = {
  userId: string;
  postId: string;
  comment: string;
  media?: File;
};
export type INewReply = {
  userId: string;
  commentId: string;
  reply: string;
  media?: File;
};
export type INewGame = {
  userId: string;
  caption: string;
  playersNumber?: number;
  governorate?: string;
  city?: string;
  playgroundName?: string;
  dateTime: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  friendship: any;
  name?: string;
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  email: string;
  username: string;
  password: string;
};
export type IRegisteredUser = {
  email: string;
  password: string;
};
export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};
export type ICreatedPost = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string;
  $updatedAt: string;
  caption: string;
  creator: any;
  isGame: boolean;
  postLikes: IUser[];
  location: string;
  media: string[];
  mediaIds: string[];
  players: number;
  privacy: string;
};
