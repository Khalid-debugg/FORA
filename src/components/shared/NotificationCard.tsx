import type { INotification } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useAddFriend } from "@/lib/react-query/queriesAndMutations/friendship";
import {
  useRemoveFriendRequest,
  useDeleteNotification,
} from "@/lib/react-query/queriesAndMutations/notifications";
import { useState, useEffect } from "react";
import { X, Check, Eye, Undo2 } from "lucide-react";

const NotificationCard = ({
  notification,
}: {
  notification: INotification;
}) => {
  const { user } = useUserContext();
  const { mutateAsync: addFriend } = useAddFriend(user, {
    $id: notification.senderId[0],
    name: notification.senderName[0],
    imageUrl: notification.senderImageUrl[0],
  });
  const { mutateAsync: removeFriendRequest } = useRemoveFriendRequest(user, {
    $id: notification.senderId[0],
    name: notification.senderName[0],
    imageUrl: notification.senderImageUrl[0],
  });
  const { mutate: deleteNotification } = useDeleteNotification();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isDeleting) {
      timeoutId = setTimeout(() => {
        deleteNotification({
          type: notification.type,
          senderId: notification.senderId[0],
          senderName: notification.senderName[0],
          senderImageUrl: notification.senderImageUrl[0],
          receiverId: notification.receiverId,
          postId: notification.postId,
          gameId: notification.gameId,
          message: notification.message,
        });
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
      await addFriend();
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
      <Card className="w-full border-l-4 border-l-orange-400 bg-orange-50/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700">
                Notification will be deleted in 2 seconds...
              </span>
            </div>
            {showUndo && (
              <Button
                onClick={handleUndo}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Undo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log(notification);

  return (
    <Card className="w-full hover:shadow-md transition-all duration-200 border-l-4 border-l-primary-500 bg-gradient-to-r from-blue-50/30 to-transparent">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with profile and delete button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link
                to={`/profile/${notification.senderId[notification.senderId.length - 1]}`}
                className="flex-shrink-0 group"
              >
                <div className="relative">
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                    src={
                      notification.senderImageUrl[
                        notification.senderImageUrl.length - 1
                      ] || "/placeholder.svg"
                    }
                    alt="profile-pic"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary-500 rounded-full border-2 border-white"></div>
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed break-words">
                  {notification.message}
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
              onClick={() => {
                setIsDeleting(true);
                setShowUndo(true);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {notification.type === "FRIEND_REQUEST" && (
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleAcceptFriendRequest}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm flex-1 max-w-32"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={handleRejectFriendRequest}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex-1 max-w-32"
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            )}

            {notification.gameId && (
              <Link to={`/game-post/${notification.gameId}`} className="block">
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Game
                </Button>
              </Link>
            )}

            {notification.postId && (
              <Link
                to={`/normal-post/${notification.postId}`}
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
