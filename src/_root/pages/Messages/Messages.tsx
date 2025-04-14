import MessagesContainter from "@/components/shared/Messages/MessagesContainter";
import { useUserContext } from "@/context/AuthContext";
import { useGetChats } from "@/lib/react-query/queriesAndMutations/chats";
import { useEffect, useMemo, useState } from "react";

const Messages = () => {
  const { user } = useUserContext();
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  }>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChats(
    user?.id,
  );
  const chats = useMemo(() => data?.pages.flat() || [], [data]);
  const unreadChats = useMemo(() => {
    if (!chats || chats.length === 0 || !user?.id) return [];
    return chats.filter(
      (chat) =>
        chat?.lastMessage?.sender?.$id !== user?.id &&
        !chat?.lastMessage?.readBy?.some((u) => u.$id === user?.id),
    );
  }, [chats, user?.id]);
  console.log(unreadChats);

  return (
    <div className="flex flex-col gap-4 md:w-1/3 w-full mx-auto items-center">
      <div className="flex h-full w-full">
        <div className="w-full md:w-1/3 border-r border-green-200 flex flex-col">
          <div className="p-4 border-b border-green-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              <>
                {chats.map((chat: any) => (
                  <div
                    key={chat.$id}
                    onClick={() =>
                      setSelectedChat({ id: chat.$id, name: chat.name })
                    }
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
                      <p className="font-semibold">{chat.name}</p>
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
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              {selectedChat
                ? selectedChat.name
                : "Select a chat to start messaging"}
            </h2>
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
