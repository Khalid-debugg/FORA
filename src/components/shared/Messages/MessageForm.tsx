import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUserContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { IoSend, IoCamera } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { messageValidation } from "@/lib/validation";
import { useCreateMessage } from "@/lib/react-query/queriesAndMutations/messages";

const MessageForm = ({ selectedChat }) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [file, setFile] = useState<File | undefined>(undefined);

  const { mutateAsync: createMessage, isPending: isSending } = useCreateMessage(
    selectedChat.id,
  );

  const form = useForm<z.infer<typeof messageValidation>>({
    resolver: zodResolver(messageValidation),
    defaultValues: {
      content: "",
      media: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media", file);
      setFile(file);
    }
  };

  const handleRemoveFile = () => {
    form.setValue("media", undefined);
    setFile(undefined);
  };

  const onSubmit = async (values: z.infer<typeof messageValidation>) => {
    try {
      const messagePayload = {
        chatId: selectedChat.id,
        message: values,
        userId: user?.id,
      };
      console.log(messagePayload);

      const newMessage = await createMessage(messagePayload);

      if (newMessage) {
        form.reset();
        setFile(undefined);
      } else {
        toast({
          variant: "error",
          title: "Something went wrong.",
          description: "Message not sent. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full border-t p-4 bg-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <Avatar>
            <AvatarImage
              className="h-10 w-10 rounded-full"
              src={user?.imageUrl}
            />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your message..."
                    className="rounded-xl border-gray-300"
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
                    id={`file-input-${selectedChat.id}`}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    onClick={(e) => (e.currentTarget.value = "")}
                  />
                </FormControl>
                <label
                  htmlFor={`file-input-${selectedChat.id}`}
                  className="cursor-pointer "
                >
                  <IoCamera
                    size={40}
                    className="text-gray-600 p-2 rounded-full hover:bg-gray-200 transition shad-button_primary hover:shad-button_ghost"
                  />
                </label>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSending}
            className="rounded-full p-3 hover:bg-primary-700 transition shad-button_primary hover:shad-button_ghost"
          >
            {!isSending ? (
              <IoSend size={20} />
            ) : (
              <div className="animate-spin">⚽</div>
            )}
          </Button>
        </form>
      </Form>

      {file && (
        <div className="mt-3 relative bg-slate-100 p-3 rounded-lg w-fit">
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:bg-red-100"
          >
            <AiOutlineClose size={14} />
          </button>
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-40 w-40 object-cover rounded-md"
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              controls
              className="h-40 w-40 object-cover rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageForm;
