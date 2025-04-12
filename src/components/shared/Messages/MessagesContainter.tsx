import { useEffect, useRef } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetMessages } from "@/lib/react-query/queriesAndMutations/messages";

const MessagesContainter = ({ selectedChat }) => {
  const { user } = useUserContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetMessages(selectedChat.id);

  const containerRef = useRef(null);
  const messages = data?.pages.flat() || [];
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = (e) => {
    const top = e.target.scrollTop;
    if (top === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 h-full overflow-y-auto flex flex-col-reverse justify-start p-4 gap-2"
    >
      {isLoading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet</p>
      ) : (
        messages.map((message) => (
          <div
            key={message?.$id}
            className={`flex items-center ${
              message?.sender?.$id === user?.id ? "self-end " : "self-start "
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
                className={`px-4 py-2  max-w-xs rounded-lg ${message?.sender?.$id === user?.id ? "bg-green-500 text-white" : "bg-gray-100 text-black"}`}
              >
                {message?.content}
              </p>
              <p className="text-[0.65rem] text-gray-500">
                {formatDate(message?.$createdAt)}
              </p>
            </div>
          </div>
        ))
      )}
      {isFetchingNextPage && (
        <p className="text-center text-gray-500">Loading more...</p>
      )}
      {!hasNextPage && messages.length > 0 && (
        <p className="text-center text-gray-400 text-sm">
          Start of conversation
        </p>
      )}
    </div>
  );
};

export default MessagesContainter;
