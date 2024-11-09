import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { replyValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoSend, IoCamera } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useToast } from "@/components/ui/use-toast";
import Replies from "./Replies";
import { useCreateReply } from "@/lib/react-query/queriesAndMutations/replies";

const RepliesSection = ({ comment, isRepliesClicked }) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [file, setFile] = useState(undefined);
  const { mutateAsync: createReply, isPending: isReplying } = useCreateReply(
    comment?.$id,
  );
  const replyRef = useRef(null);
  const form = useForm<z.infer<typeof replyValidation>>({
    resolver: zodResolver(replyValidation),
    defaultValues: {
      reply: "",
      media: undefined,
    },
  });

  const handleFileChange = (event) => {
    form.setValue("media", event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(undefined);
  };

  async function onSubmit(values: z.infer<typeof replyValidation>) {
    try {
      const postVariables = {
        userId: user.id,
        commentId: comment?.$id,
        ...values,
      };
      const newComment = await createReply(postVariables);

      if (newComment) {
        form.reset();
        setFile(undefined);
      } else {
        toast({
          variant: "error",
          title: "Uh oh! Something went wrong.",
          description: "Please try again.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className={`px-4 overflow-auto transition-all ease-in-out duration-[500ms] ${
        isRepliesClicked
          ? "max-h-[10000px] opacity-100 py-2"
          : "max-h-[0px] opacity-0 py-0"
      }`}
    >
      <div className="flex gap-4 items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-2 items-center w-full py-2"
          >
            <Avatar className="hover:cursor-pointer">
              <AvatarImage
                className="h-12 w-12 rounded-full outline outline-slate-200"
                src={user.imageUrl}
              />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem className="flex-1" ref={replyRef}>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write a reply..."
                      className="outline outline-1 outline-primary-500"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media"
              render={() => (
                <FormItem className="relative">
                  <FormControl>
                    <input
                      type="file"
                      id={`file-input-${comment?.$id}`}
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                      onClick={(e) => (e.target.value = null)}
                    />
                  </FormControl>
                  <label
                    htmlFor={`file-input-${comment?.$id}`}
                    className="cursor-pointer "
                  >
                    <IoCamera
                      size={40}
                      className="text-gray-600 p-2 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
                    />
                  </label>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="self-center my-3 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
            >
              {!isReplying ? (
                <IoSend size={25} />
              ) : (
                <div className="animate-spin">⚽</div>
              )}
            </Button>
          </form>
        </Form>
      </div>
      {file && (
        <div className="flex gap-2 my-4 flex-wrap bg-slate-100 p-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => handleRemoveFile()}
              className="absolute top-0 right-0 bg-white rounded-full p-1 m-1 text-red-500 hover:bg-red-100 z-50"
            >
              <AiOutlineClose size={15} />
            </button>
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`preview file`}
                className="h-48 w-48 object-cover rounded"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="h-48 w-48 object-cover rounded"
              />
            )}
          </div>
        </div>
      )}
      <Replies comment={comment} replyRef={replyRef} />
    </div>
  );
};

export default RepliesSection;
