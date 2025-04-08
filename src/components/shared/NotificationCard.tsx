import { INotification } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useAddFriend } from "@/lib/react-query/queriesAndMutations/Profile";
import {
  useRemoveFriendRequest,
  useDeleteNotification,
} from "@/lib/react-query/queriesAndMutations/notifications";
import { useState, useEffect } from "react";

const NotificationCard = ({
  notification,
}: {
  notification: INotification;
}) => {
  const { user } = useUserContext();
  const { mutateAsync: addFriend } = useAddFriend();
  const { mutateAsync: removeFriendRequest } = useRemoveFriendRequest(
    user?.id || "",
    notification.sender,
  );
  const { mutate: deleteNotification } = useDeleteNotification(
    notification.$id,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isDeleting) {
      timeoutId = setTimeout(() => {
        deleteNotification();
        setIsDeleting(false);
        setShowUndo(false);
      }, 2000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isDeleting, deleteNotification]);

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
      setIsDeleting(true);
      setShowUndo(true);
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
      setIsDeleting(true);
      setShowUndo(true);
    } catch (error) {
      toast({
        title: "Failed to reject friend request",
        variant: "error",
      });
    }
  };

  const handleUndo = () => {
    setIsDeleting(false);
    setShowUndo(false);
  };

  if (isDeleting) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            {showUndo && (
              <Button
                onClick={handleUndo}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Undo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

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
