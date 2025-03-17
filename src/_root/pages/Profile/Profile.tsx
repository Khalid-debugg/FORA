import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useGetUser } from "@/lib/react-query/queriesAndMutations/users";
import { IoPersonAddSharp, IoSettings } from "react-icons/io5";
import { MdPersonRemove } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SetupForm } from "@/_root/forms/SetupForm";
import ProfilePicture from "@/components/shared/Profile/ProfilePicture";
import CoverImage from "@/components/shared/Profile/CoverImage";
import ProfileSections from "@/components/shared/Profile/ProfileSections/ProfileSections";
import {
  useAddFriendRequest,
  useCheckIsFriendRequestSent,
  useRemoveFriendRequest,
} from "@/lib/react-query/queriesAndMutations/notifications";
import {
  useCheckIsFriend,
  useUnfriend,
} from "@/lib/react-query/queriesAndMutations/friendship";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();
  const { data: visitedUser, isPending: isGettingUser } = useGetUser(id!);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const { mutateAsync: addFriendRequest, isPending: isAddingRequest } =
    useAddFriendRequest(
      currentUser?.id || "",
      currentUser?.name || "",
      visitedUser?.$id || "",
    );
  const { mutateAsync: removeFriendRequest, isPending: isRemovingRequest } =
    useRemoveFriendRequest(currentUser?.id || "", visitedUser?.$id || "");
  const { mutateAsync: unFriend, isPending: isUnfriending } = useUnfriend(
    visitedUser?.$id || "",
    currentUser?.id || "",
  );
  const { data } = useCheckIsFriend(
    visitedUser?.$id || "",
    currentUser?.id || "",
  );
  const { data: isFriendRequestSent } = useCheckIsFriendRequestSent(
    currentUser?.id || "",
    visitedUser?.$id || "",
  );
  if (isGettingUser || !currentUser)
    return <div className="h-full animate-spin">⚽</div>;
  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
      <CoverImage user={visitedUser} currentUser={currentUser} />
      <div className="relative px-4 flex flex-col gap-2">
        <ProfilePicture user={visitedUser} currentUser={currentUser} />
        <div className="flex gap-2 justify-end mt-4">
          {currentUser.id === visitedUser?.$id ? (
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
              <DialogContent>
                <SetupForm user={visitedUser} setIsSetupOpen={setIsSetupOpen} />
              </DialogContent>
            </Dialog>
          ) : !data?.isFriend ? (
            isFriendRequestSent ? (
              <Button
                onClick={() => removeFriendRequest()}
                variant="outline"
                className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                disabled={isRemovingRequest}
              >
                <MdPersonRemove />
                <p>Remove Friend Request</p>
              </Button>
            ) : (
              <Button
                onClick={() => addFriendRequest()}
                variant="outline"
                className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                disabled={isAddingRequest}
              >
                <IoPersonAddSharp />
                <p>Add Friend</p>
              </Button>
            )
          ) : (
            <Button
              onClick={() => unFriend(data.friendShipId)}
              variant="outline"
              className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
              disabled={isUnfriending}
            >
              <MdPersonRemove />
              <p>Unfriend</p>
            </Button>
          )}
        </div>
        <div className="mt-24">
          <h1 className="text-xl font-bold">
            {visitedUser?.name || "Unnamed User"}
          </h1>
          <p className="text-gray-500">@{visitedUser?.username || "unknown"}</p>
        </div>
        <Card>
          <CardContent className="flex flex-col p-4 gap-2">
            <span>
              <strong className="text-black"></strong> Friends
            </span>
            {visitedUser?.bio && <p>{visitedUser?.bio}</p>}
            <div className="flex flex-wrap gap-2">
              {visitedUser?.tags?.length > 0 &&
                visitedUser?.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="p-2 border border-slate-100 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>
        <ProfileSections />
      </div>
    </div>
  );
};

export default Profile;
