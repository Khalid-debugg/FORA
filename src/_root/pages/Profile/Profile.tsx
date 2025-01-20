import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useGetUser } from "@/lib/react-query/queriesAndMutations/users";
import { IoPersonAddSharp, IoSettings } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SetupForm } from "@/_root/forms/SetupForm";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();
  const { data: user, isPending: isGettingUser } = useGetUser(id!);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const handleSetupSubmit = (formData: FormData) => {
    console.log("Form submitted:", formData);

    setIsSetupOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
      {isGettingUser ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="relative h-48 md:h-64 bg-gray-300">
            <img
              src={user?.CoverUrl || "/public/assets/images/gray-texture.jpg"}
              alt="Profile Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="relative px-4">
            <div className="absolute -top-16 left-4 border-4 border-white rounded-full bg-white">
              <img
                src={user?.imageUrl || "/default-avatar.png"}
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <div className="flex flex-col gap-2">
                {currentUser.id !== user?.accountID &&
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
                  )}
                {currentUser.id === user?.accountID && (
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
                      <SetupForm user={user} onSubmit={handleSetupSubmit} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h1 className="text-xl font-bold">
                {user?.name || "Unnamed User"}
              </h1>
              <p className="text-gray-500">@{user?.username || "unknown"}</p>
            </div>
            <Card className="mt-4">
              <CardContent className="pt-4">
                <p>
                  {user?.bio || "Web developer | Coffee enthusiast | Dog lover"}
                </p>
                <div className="flex gap-4 mt-2 text-gray-500">
                  <span>
                    <strong className="text-black">
                      {user?.followingCount || 0}
                    </strong>{" "}
                    Following
                  </span>
                  <span>
                    <strong className="text-black">
                      {user?.followersCount || 0}
                    </strong>{" "}
                    Followers
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
