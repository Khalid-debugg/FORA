import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useGetUser } from "@/lib/react-query/queriesAndMutations/users";
import { IoPersonAddSharp, IoSettings } from "react-icons/io5";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SetupForm } from "@/_root/forms/SetupForm";
import ProfilePicture from "@/components/shared/Profile/ProfilePicture";
import CoverImage from "@/components/shared/Profile/CoverImage";
import ProfileSections from "@/components/shared/Profile/ProfileSections/ProfileSections";
const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();
  const { data: user, isPending: isGettingUser } = useGetUser(id!);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
      {isGettingUser ? (
        <div>Loading...</div>
      ) : (
        <>
          <CoverImage user={user} currentUser={currentUser} />
          <div className="relative px-4 flex flex-col gap-2">
            <ProfilePicture user={user} currentUser={currentUser} />
            <div className="flex gap-2 justify-end mt-4">
              <div className="flex flex-col gap-2">
                {currentUser.id !== user?.$id ? (
                  !currentUser?.friendship?.friends?.some(
                    (friend) => friend.id === user?.accountID,
                  ) && (
                    <Button
                      variant="outline"
                      className="flex gap-2 rounded-full shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
                    >
                      <IoPersonAddSharp />
                      <p>Add</p>
                    </Button>
                  )
                ) : (
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
                      <SetupForm user={user} setIsSetupOpen={setIsSetupOpen} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="mt-24">
              <h1 className="text-xl font-bold">
                {user?.name || "Unnamed User"}
              </h1>
              <p className="text-gray-500">@{user?.username || "unknown"}</p>
            </div>
            <Card>
              <CardContent className="flex flex-col p-4 gap-2">
                <span>
                  <strong className="text-black">
                    {/* {user?.friends.length || 0} */}
                  </strong>{" "}
                  Friends
                </span>
                {user?.bio && <p>{user?.bio}</p>}
                <div className="flex flex-wrap gap-2">
                  {user?.tags.length > 0 &&
                    user?.tags.map((tag, idx) => (
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
        </>
      )}
    </div>
  );
};

export default Profile;
