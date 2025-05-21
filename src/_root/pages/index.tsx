import { lazy } from "react";

export const Home = lazy(() => import("./Home/Home"));
export const CreatePost = lazy(() => import("./Home/CreatePost"));
export const Profile = lazy(() => import("./Profile/Profile"));
export const OneNormalPost = lazy(() => import("./NormalPost/OneNormalPost"));
export const OneGamePost = lazy(() => import("./GamePost/OneGamePost"));
export const Notifications = lazy(
  () => import("./Notifications/Notifications"),
);
export const Explore = lazy(() => import("./Explore/Explore"));
export const Messages = lazy(() => import("./Messages/Messages"));
