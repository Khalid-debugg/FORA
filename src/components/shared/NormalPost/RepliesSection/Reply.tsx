import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { BiSolidLike } from "react-icons/bi";

const Reply = ({ reply, mimeType }) => {
  return (
    <div className="flex flex-col">
      <div key={reply.$id} className="flex gap-4 items-center">
        <Avatar className="hover:cursor-pointer self-start">
          <AvatarImage
            className="h-12 w-12 rounded-full outline outline-slate-200"
            src={reply.creator?.imageURL}
          />
          <AvatarFallback>{reply.creator?.username}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-slate-100 flex-1 p-2 rounded-lg">
            <p>{reply.content}</p>
            {reply.mediaUrl && mimeType?.mimeType?.includes("image") ? (
              <img
                src={reply.mediaUrl}
                alt="comment"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : reply.mediaUrl && mimeType?.mimeType?.includes("video") ? (
              <video
                src={reply.mediaUrl}
                controls
                className="w-32 h-32 object-cover rounded-lg"
              ></video>
            ) : null}
          </div>
        </div>
        {reply.likes?.length > 0 && (
          <div className="flex gap-1">
            <p className="text-sm"> {reply.likes?.length}</p>
            <BiSolidLike fill="green" size={20} />
          </div>
        )}
      </div>
      <div className="flex gap-8 pl-16">
        <button className="text-sm" onClick={() => {}}>
          Reply
        </button>
        <button className="text-sm">Like</button>
      </div>
    </div>
  );
};

export default Reply;
