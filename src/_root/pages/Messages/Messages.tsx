import MessagesContainter from "@/components/shared/Messages/MessagesContainter";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  useEditChat,
  useGetChats,
} from "@/lib/react-query/queriesAndMutations/chats";
import { CiEdit } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useMemo, useState } from "react";

const Messages = () => {
  const { user } = useUserContext();
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  }>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isGettingChats,
  } = useGetChats(user?.id);
  const chats = useMemo(() => data?.pages.flat() || [], [data]);
  const [isEditingChatName, setIsEditingChatName] = useState(false);
  const { mutateAsync: editChat } = useEditChat(selectedChat?.id, user?.id);
  const unreadChats = useMemo(() => {
    if (!chats || chats.length === 0 || !user?.id) return [];
    return chats.filter(
      (chat) =>
        chat?.lastMessage?.sender?.$id !== user?.id &&
        !chat?.lastMessage?.readBy?.some((u) => u.$id === user?.id),
    );
  }, [chats, user?.id]);
  const handleChatSelection = (chat: any) => {
    setSelectedChat({
      id: chat.$id,
      name: chat.name
        ? chat.name
        : chat.participants
            .filter((p: any) => p.$id !== user?.id)
            .map((p: any) => p.name)
            .join(", "),
    });
  };
  return (
    <div className="flex flex-col gap-4 md:w-1/3 w-full mx-auto items-center">
      <div className="flex h-full w-full">
        <div className="w-full md:w-1/3 border-r border-green-200 flex flex-col">
          <div className="p-4 border-b border-green-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isGettingChats && (
              <div className="animate-spin text-center">⚽</div>
            )}
            {chats.length === 0 && !isGettingChats ? (
              <div className="p-4 text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              <>
                {chats.map((chat: any) => (
                  <div
                    key={chat.$id}
                    onClick={() => handleChatSelection(chat)}
                    className={`w-full flex items-center p-4 cursor-pointer hover:bg-green-50 border-b ${
                      selectedChat?.id === chat.$id ? "bg-green-100" : ""
                    }`}
                  >
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={
                        chat.lastMessage?.sender?.imageUrl ||
                        "/default-avatar.png"
                      }
                      loading="lazy"
                      alt="avatar"
                    />
                    <div className="flex-1 text-sm text-left">
                      <p className="font-semibold">
                        {chat.name
                          ? chat.name
                          : chat.participants
                              .filter((p: any) => p.$id !== user?.id)
                              .map((p: any) => p.name)
                              .join(", ")}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {unreadChats.some((c) => c.$id === chat.$id) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full justify-end"></div>
                    )}
                  </div>
                ))}
                {hasNextPage && (
                  <div className="p-4 text-center">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {isFetchingNextPage ? "Loading..." : "Show More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-200">
            {selectedChat && !isEditingChatName && (
              <>
                <h2>{selectedChat?.name || "New Chat"} </h2>
                <button onClick={() => setIsEditingChatName((prev) => !prev)}>
                  <CiEdit />
                </button>
              </>
            )}
            {selectedChat && isEditingChatName && (
              <>
                <Input
                  type="text"
                  defaultValue={selectedChat?.name}
                  onChange={(e) => {
                    setSelectedChat((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedChat((prev) => ({
                      ...prev,
                      name: selectedChat?.name,
                    }));
                    editChat({ newChat: selectedChat });
                    setIsEditingChatName(false);
                  }}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingChatName(false)}
                  className="py-2 px-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  <MdOutlineCancel size={20} />
                </button>
              </>
            )}
            {!selectedChat && (
              <h2 className="text-xl font-semibold">Select a Chat</h2>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
            {selectedChat ? (
              <MessagesContainter selectedChat={selectedChat} />
            ) : (
              <p className="text-gray-500">
                Select a conversation to start messaging
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
