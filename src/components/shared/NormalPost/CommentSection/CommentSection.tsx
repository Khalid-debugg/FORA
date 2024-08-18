import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { commentValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoSend, IoCamera } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useCreateComment } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import Comments from "./Comments";

const CommentSection = ({ post, isCommentClicked }) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [file, setFile] = useState(undefined);
  const { mutateAsync: createComment } = useCreateComment(post.$id);
  const [refetchComments, setRefetchComments] = useState(false);

  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment: "",
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

  async function onSubmit(values: z.infer<typeof commentValidation>) {
    try {
      const postVariables = {
        userId: user.id,
        postId: post.$id,
        ...values,
      };
      const newComment = await createComment(postVariables);

      if (newComment) {
        setRefetchComments(true);
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
      className={`px-4 overflow-hidden transition-all ease-in-out duration-500 ${
        isCommentClicked
          ? "max-h-auto opacity-100 py-2"
          : "max-h-[0px] opacity-0 py-0"
      }`}
    >
      <div className="flex gap-4 items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-2 items-center w-full"
          >
            <Avatar className="hover:cursor-pointer">
              <AvatarImage
                className="h-12 w-12 rounded-full outline outline-slate-200"
                src={user.imageURL}
              />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Write a comment..."
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
                      id="file-input"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <label htmlFor="file-input" className="cursor-pointer ">
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
              <IoSend size={25} />
            </Button>
          </form>
        </Form>
      </div>
      {file && (
        <div className="flex gap-2 mt-4 flex-wrap bg-slate-100 p-4">
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
      <Comments
        post={post}
        refetchComments={refetchComments}
        setRefetchComments={setRefetchComments}
      />
    </div>
  );
};

export default CommentSection;
