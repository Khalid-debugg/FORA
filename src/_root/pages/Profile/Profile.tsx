import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const Profile = () => {
  const { user } = useUserContext();
  return (
    <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full mx-auto">
      <div className="relative h-48 md:h-64 bg-gray-300">
        <img
          src="/placeholder.svg?height=256&width=768"
          alt="Profile Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="relative px-4">
        <div className="absolute -top-16 left-4 border-4 border-white rounded-full bg-white">
          <img
            src={user.imageUrl}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="rounded-full">
            Follow
          </Button>
        </div>
        <div className="mt-6">
          <h1 className="text-xl font-bold">{"user.name"}</h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>
        <Card className="mt-4">
          <CardContent className="pt-4">
            <p>Web developer | Coffee enthusiast | Dog lover</p>
            <div className="flex gap-4 mt-2 text-gray-500">
              <span>
                <strong className="text-black">500</strong> Following
              </span>
              <span>
                <strong className="text-black">2.5K</strong> Followers
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
