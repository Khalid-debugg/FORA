import { useState, useMemo } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "@/lib/react-query/queriesAndMutations/users";
import { IoPersonAddSharp, IoSettings } from "react-icons/io5";
import { MdPersonRemove } from "react-icons/md";
import { RiMessageFill } from "react-icons/ri";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SetupForm } from "@/_root/forms/SetupForm";
import ProfilePicture from "@/components/shared/Profile/ProfilePicture";
import CoverImage from "@/components/shared/Profile/CoverImage";
import ProfileSections from "@/components/shared/Profile/ProfileSections/ProfileSections";
import {
  useAddFriendRequest,
  useCheckIsFriendRequestReceived,
  useCheckIsFriendRequestSent,
  useRemoveFriendRequest,
} from "@/lib/react-query/queriesAndMutations/notifications";
import {
  useAddFriend,
  useCheckIsFriend,
  useUnfriend,
} from "@/lib/react-query/queriesAndMutations/friendship";
import {
  useCreateNewChat,
  useGetChatId,
} from "@/lib/react-query/queriesAndMutations/chats";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/ui/loadingSpinner";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();
  const { data: visitedUser, isPending: isGettingUser } = useGetUser(id!);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const memoizedCurrentUser = useMemo(() => currentUser, [currentUser?.id]);
  const memoizedVisitedUser = useMemo(() => visitedUser, [visitedUser?.$id]);

  const { mutateAsync: addFriendRequest, isPending: isAddingRequest } =
    useAddFriendRequest(memoizedCurrentUser, memoizedVisitedUser);
  const { mutateAsync: removeFriendRequest, isPending: isRemovingRequest } =
    useRemoveFriendRequest(memoizedCurrentUser, memoizedVisitedUser);
  const { mutateAsync: addFriend, isPending: isAddingFriend } = useAddFriend(
    memoizedCurrentUser,
    memoizedVisitedUser,
  );
  const { data: chatId } = useGetChatId(
    memoizedCurrentUser?.id || "",
    memoizedVisitedUser?.$id || "",
  );
  const { mutateAsync: createNewChat, isPending: isCreatingChat } =
    useCreateNewChat(memoizedCurrentUser?.id || "");

  const { mutateAsync: unFriend, isPending: isUnfriending } = useUnfriend(
    memoizedVisitedUser?.$id || "",
    memoizedCurrentUser?.id || "",
  );
  const { data } = useCheckIsFriend(
    memoizedVisitedUser?.$id || "",
    memoizedCurrentUser?.id || "",
  );
  const { data: isFriendRequestSent } = useCheckIsFriendRequestSent(
    memoizedCurrentUser,
    memoizedVisitedUser,
    {
      enabled: !!memoizedCurrentUser?.id && !!memoizedVisitedUser?.$id,
    },
  );
  const { data: isFriendRequestReceived } = useCheckIsFriendRequestReceived(
    memoizedCurrentUser,
    memoizedVisitedUser,
    {
      enabled: !!memoizedCurrentUser?.id && !!memoizedVisitedUser?.$id,
    },
  );
  if (isGettingUser || !currentUser)
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-2 p-2 md:w-1/3 w-full mx-auto">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <CoverImage user={visitedUser} currentUser={currentUser} />
      <div className="relative px-4 flex flex-col gap-2">
        <ProfilePicture user={visitedUser} currentUser={currentUser} />
        <div className="flex flex-col min-w-1/6 gap-2 self-end mt-4">
          {currentUser.id === visitedUser?.$id && (
            <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2 rounded-full hover:bg-slate-100"
                >
                  <IoSettings />
                  <p>Setup</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                <SetupForm user={visitedUser} setIsSetupOpen={setIsSetupOpen} />
              </DialogContent>
            </Dialog>
          )}
          {currentUser.id !== visitedUser?.$id &&
            !data?.isFriend &&
            (isFriendRequestSent ? (
              <Button
                onClick={() => removeFriendRequest()}
                variant="outline"
                className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                disabled={isRemovingRequest}
              >
                <MdPersonRemove size={20} />
                <p>Remove Friend Request</p>
              </Button>
            ) : isFriendRequestReceived ? (
              <div className="flex">
                <Button
                  onClick={() => removeFriendRequest()}
                  variant="outline"
                  className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                  disabled={isRemovingRequest}
                >
                  <MdPersonRemove size={20} />
                  <p>Decline</p>
                </Button>
                <Button
                  onClick={() => addFriend()}
                  variant="outline"
                  className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                  disabled={isAddingFriend}
                >
                  <IoPersonAddSharp size={18} />
                  <p>Accept</p>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => addFriendRequest()}
                variant="outline"
                className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                disabled={isAddingRequest}
              >
                <IoPersonAddSharp size={20} />
                <p>Add Friend</p>
              </Button>
            ))}
          {currentUser.id !== visitedUser?.$id && data?.isFriend && (
            <Button
              onClick={() => unFriend(data.friendShipId)}
              variant="outline"
              className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
              disabled={isUnfriending}
            >
              <MdPersonRemove size={20} />
              <p>Unfriend</p>
            </Button>
          )}
          {currentUser.id !== visitedUser?.$id && (
            <Button
              onClick={async () => {
                if (chatId) {
                  navigate(`/messages/${chatId}`);
                } else {
                  const newChatId = await createNewChat({
                    userId: currentUser?.id || "",
                    friendId: visitedUser?.$id || "",
                  });
                  navigate(`/messages/${newChatId}`);
                }
              }}
              variant="outline"
              className="flex gap-2 rounded-full shad-button_ghost transition-all duration-100 ease-in-out"
              disabled={isCreatingChat}
            >
              <RiMessageFill size={20} />
              <p>Message</p>
            </Button>
          )}
        </div>
        <div className="mt-24">
          <h1 className="text-xl font-bold">
            {visitedUser?.name || "Unnamed User"}
          </h1>
          <p className="text-gray-500">@{visitedUser?.username || "unknown"}</p>
        </div>
        {(visitedUser?.bio || visitedUser?.tags?.length > 0) && (
          <Card>
            <CardContent className="flex flex-col p-4 gap-2">
              {visitedUser?.bio && <p>{visitedUser?.bio}</p>}
              <div className="flex flex-wrap gap-2">
                {visitedUser?.tags?.length > 0 &&
                  visitedUser?.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="text-sm border rounded-lg border-slate-500"
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        <ProfileSections />
      </div>
    </div>
  );
};

export default Profile;
