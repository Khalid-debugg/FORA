import { useState } from "react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex flex-col gap-4 md:w-1/3 w-full mx-auto items-center">
      <div className="flex h-full w-full">
        <div className="w-full md:w-1/3 border-r border-green-200 flex flex-col">
          <div className="p-4 border-b border-green-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto h-full">
            <div className="p-4 text-center text-gray-500">No messages yet</div>
          </div>
        </div>
        <div className="hidden md:flex flex-col flex-1">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Select a chat to start messaging
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
