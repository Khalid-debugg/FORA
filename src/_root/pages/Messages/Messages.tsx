import MessagesContainter from "@/components/shared/Messages/MessagesContainter";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  useEditChat,
  useGetChats,
  useMakeChatRead,
} from "@/lib/react-query/queriesAndMutations/chats";
import { CiEdit } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Messages = () => {
  const { user } = useUserContext();
  const { chatId } = useParams();
  const { mutateAsync: makeChatRead } = useMakeChatRead(chatId || "", user?.id);
  const navigate = useNavigate();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isGettingChats,
  } = useGetChats(user?.id);

  const chats = useMemo(() => data?.pages.flat() || [], [data]);

  const [isEditingChatName, setIsEditingChatName] = useState(false);
  const [editingName, setEditingName] = useState("");

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.$id === chatId),
    [chatId, chats],
  );

  const { mutateAsync: editChat } = useEditChat(chatId, user?.id);
  const getChatImage = (chat: any) => {
    if (chat?.lastMessage?.sender?.$id !== user?.id && chat?.lastMessage) {
      return chat?.lastMessage?.sender?.imageUrl;
    }

    const otherParticipant = chat?.participants.find(
      (p: any) => p.$id !== user?.id,
    );

    return otherParticipant?.imageUrl || "/default-avatar.png";
  };
  const getChatName = (chat: any) => {
    if (chat?.name) return chat?.name;
    return chat.participants
      .filter((p) => p.$id !== user?.id)
      .map((p) => p.name)
      .join(", ");
  };

  const unreadChats = useMemo(() => {
    if (!chats || !user?.id) return [];
    return chats.filter(
      (chat) =>
        chat?.lastMessage &&
        chat?.lastMessage?.sender?.$id !== user?.id &&
        !chat?.lastMessage?.readBy?.some((u) => u.$id === user?.id),
    );
  }, [chats, user?.id]);

  useEffect(() => {
    const findChat = async () => {
      let found = chats.some((chat) => chat.$id === chatId);
      while (!found && hasNextPage) {
        await fetchNextPage();
        found = data?.pages.flat().some((chat) => chat.$id === chatId);
      }
    };
    if (chatId && !selectedChat) {
      findChat();
    }
  }, [chatId, chats, data, fetchNextPage, hasNextPage, selectedChat]);
  useEffect(() => {
    if (unreadChats.length > 0 && unreadChats.some((c) => c.$id === chatId))
      makeChatRead();
  }, [chatId, makeChatRead, unreadChats]);
  const handleChatSelection = (chat: any) => {
    navigate(`/messages/${chat.$id}`);
    setIsEditingChatName(false);
  };

  return (
    <div className="flex flex-col gap-4 md:w-1/3 w-full mx-auto items-center">
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <div className="flex h-full w-full">
        <div className="w-full md:w-1/3 border-r border-green-200 flex flex-col">
          <div className="p-4 border-b border-green-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isGettingChats && (
              <div className="animate-spin text-center">⚽</div>
            )}
            {!isGettingChats && chats.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No messages yet
              </div>
            )}
            {chats.map((chat: any) => (
              <div
                key={chat.$id}
                onClick={() => handleChatSelection(chat)}
                className={`w-full flex items-center p-4 cursor-pointer hover:bg-green-50 border-b ${
                  chatId === chat.$id ? "bg-green-100" : ""
                }`}
              >
                <img
                  className="w-10 h-10 rounded-full mr-2"
                  src={getChatImage(chat)}
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
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
          </div>
        </div>
        <div className="hidden md:flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-200">
            {selectedChat ? (
              isEditingChatName ? (
                <>
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      await editChat({
                        newChat: { ...selectedChat, name: editingName },
                      });
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
              ) : (
                <>
                  <h2>{getChatName(selectedChat)}</h2>
                  <button
                    onClick={() => {
                      setEditingName(getChatName(selectedChat));
                      setIsEditingChatName(true);
                    }}
                  >
                    <CiEdit />
                  </button>
                </>
              )
            ) : (
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
