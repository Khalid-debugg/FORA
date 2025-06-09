import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetFriends } from "@/lib/react-query/queriesAndMutations/friendship";
import { useUserContext } from "@/context/AuthContext";
import { Search } from "lucide-react";
import { useInviteFriends } from "@/lib/react-query/queriesAndMutations/games";

interface Friend {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
}

interface InviteFriendsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
}

const InviteFriendsOverlay = ({
  isOpen,
  onClose,
  gameId,
}: InviteFriendsOverlayProps) => {
  const { user } = useUserContext();
  const { data: friends, isPending } = useGetFriends(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const { mutate: inviteFriends, isPending: isInviting } =
    useInviteFriends(gameId);
  const filteredFriends = friends?.filter((friend) =>
    friend?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend],
    );
  };

  const handleInvite = () => {
    inviteFriends({
      friends: selectedFriends,
      user,
    });
    setSelectedFriends([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white p-4">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="px-2 flex gap-4 items-center">
          <Checkbox
            checked={
              selectedFriends.length > 0 &&
              selectedFriends.length === filteredFriends?.length
            }
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedFriends(filteredFriends || []);
              } else {
                setSelectedFriends([]);
              }
            }}
          />
          <p className="text-sm">Select All</p>
        </div>
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {isPending ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin">⚽</div>
            </div>
          ) : filteredFriends?.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No friends found
            </p>
          ) : (
            filteredFriends?.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg"
              >
                <Checkbox
                  checked={selectedFriends.some((f) => f.id === friend.id)}
                  onCheckedChange={() => handleToggleFriend(friend)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.imageUrl} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{friend.username}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedFriends.length === 0}
            className="shad-button_primary hover:shad-button_ghost"
          >
            Invite {selectedFriends.length > 0 && `(${selectedFriends.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsOverlay;
