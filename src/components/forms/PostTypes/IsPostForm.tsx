/* eslint-disable @typescript-eslint/no-explicit-any */
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { postValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "filepond/dist/filepond.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations/posts";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const IsPostForm = ({ post }: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: createPost, isPending: postIsPending } = useCreatePost();
  const [files, setFiles] = useState([]);
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
    },
  });

  // Sync files state with the form
  const handleUpdateFiles = (fileItems: any) => {
    setFiles(fileItems);
    form.setValue(
      "file",
      fileItems.map((fileItem: any) => fileItem.file),
    );
  };

  async function onSubmit(values: z.infer<typeof postValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const postVariables = {
        userId: user.id,
        ...values,
      };
      const newPost = await createPost(postVariables);
      if (!newPost) {
        toast({
          variant: "error",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        form.reset();
      } else {
        toast({
          variant: "default",
          title: "Your post is shared successfully!",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <h2 className="self-center font-[600] bg-gradient-to-br from-green-700 to-primary-500 p-3 rounded-md text-white text-center">
            Create a post related to football or showcase your skills ⚽
          </h2>
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className="outline outline-1 outline-primary-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Media</FormLabel>
                <FormControl>
                  <FilePond
                    files={files}
                    onupdatefiles={handleUpdateFiles}
                    allowMultiple={true}
                    maxFiles={5}
                    name="files"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="self-center w-1/2 p-4 my-3 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
          >
            <p>Post</p>
            {postIsPending && <div className=" animate-spin">⚽</div>}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default IsPostForm;
