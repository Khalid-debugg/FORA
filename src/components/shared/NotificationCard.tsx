import { INotification } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useAddFriend } from "@/lib/react-query/queriesAndMutations/Profile";
import { useRemoveFriendRequest } from "@/lib/react-query/queriesAndMutations/notifications";
const NotificationCard = ({
  notification,
}: {
  notification: INotification;
}) => {
  console.log(notification);
  const { user } = useUserContext();
  const { mutateAsync: addFriend } = useAddFriend();
  const { mutateAsync: removeFriendRequest } = useRemoveFriendRequest(
    user?.id || "",
    notification.sender,
  );
  const handleAcceptFriendRequest = async () => {
    try {
      await addFriend({
        userId: user?.id || "",
        friendId: notification.sender,
      });
      toast({
        title: "Friend request accepted!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to accept friend request",
        variant: "error",
      });
    }
  };

  const handleRejectFriendRequest = async () => {
    try {
      await removeFriendRequest();
      toast({
        title: "Friend request rejected",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to reject friend request",
        variant: "error",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">{notification.message}</p>
          {notification.type === "FRIEND_REQUEST" && (
            <div className="flex gap-2">
              <Button
                onClick={handleAcceptFriendRequest}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Accept
              </Button>
              <Button
                onClick={handleRejectFriendRequest}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Decline
              </Button>
            </div>
          )}
          {notification.type === "LIKE_POST" && notification.post && (
            <Link to={`/normal-post/${notification.post.$id}`}>
              <Button variant="outline" className="w-full">
                View Post
              </Button>
            </Link>
          )}
          {notification.type === "COMMENT" && notification.post && (
            <Link to={`/normal-post/${notification.post.$id}`}>
              <Button variant="outline" className="w-full">
                View Comment
              </Button>
            </Link>
          )}
          {notification.type === "JOIN_GAME_REQUEST" && notification.game && (
            <Link to={`/game-post/${notification.game.$id}`}>
              <Button variant="outline" className="w-full">
                View Game
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
