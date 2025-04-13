import { useEffect, useRef } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetMessages } from "@/lib/react-query/queriesAndMutations/messages";
import MessageForm from "./MessageForm";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

const MessagesContainter = ({ selectedChat }) => {
  const { user } = useUserContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetMessages(selectedChat.id);
  useRealtimeMessages(selectedChat.id);
  const messages = data?.pages.flat() || [];
  const bottomRef = useRef(null);
  const hasScrolledInitially = useRef(false);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  useEffect(() => {
    if (data && !hasScrolledInitially.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        hasScrolledInitially.current = true;
      }, 200);
    }
  }, [data]);

  return (
    <div className="flex flex-col h-[100vh] overflow-y-auto">
      <div className=" flex-1 flex flex-col justify-start p-4 gap-2">
        {isFetchingNextPage && (
          <p className="text-center text-gray-500 animate-spin">⚽</p>
        )}
        {!hasNextPage && messages.length > 0 && (
          <p className="text-center text-gray-400 text-sm">
            Start of conversation
          </p>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <button
            className="text-center text-gray-500"
            onClick={() => fetchNextPage()}
          >
            Load more
          </button>
        )}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          [...messages].reverse().map((message) => (
            <div
              key={message?.$id}
              className={`flex items-center ${
                message?.sender?.$id === user?.id ? "self-end" : "self-start"
              }`}
            >
              {message?.sender?.$id !== user?.id && (
                <img
                  className="w-10 h-10 rounded-full mr-2"
                  src={message?.sender?.imageUrl || "/default-avatar.png"}
                  loading="lazy"
                  alt="avatar"
                />
              )}
              <div>
                <p
                  className={`px-4 py-2 max-w-xs rounded-lg ${
                    message?.sender?.$id === user?.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message?.content}
                </p>
                {message?.mediaUrl && message?.mediaType?.includes("image") && (
                  <img
                    className="max-w-52 max-h-52 rounded-lg"
                    src={message?.mediaUrl}
                    loading="lazy"
                    alt="media"
                  />
                )}
                {message?.mediaUrl && message?.mediaType?.includes("video") && (
                  <video className="max-w-52 max-h-52 rounded-lg" controls>
                    <source src={message?.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <p className="text-[0.65rem] text-gray-500">
                  {formatDate(message?.$createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <MessageForm selectedChat={selectedChat} />
      <div ref={bottomRef} />
    </div>
  );
};

export default MessagesContainter;
