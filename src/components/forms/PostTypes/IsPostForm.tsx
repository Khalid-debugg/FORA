import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { postValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations/posts";
import { X, Upload } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const IsPostForm = ({
  post,
  onPostCreated,
}: {
  post: any;
  onPostCreated?: () => void;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: createPost, isPending: postIsPending } = useCreatePost();
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const maxFiles = 5;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "video/mp4"];
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      if (allowedTypes.includes(file.type.toLowerCase())) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Only JPEG, PNG, and MP4 files are allowed. Invalid files: ${invalidFiles.join(", ")}`,
      });
    }

    if (files.length + validFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files.`,
      });
      return;
    }
    if (validFiles.length === 0) {
      return;
    }

    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);
    form.setValue("file", newFiles);
    validFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, url]);
      } else if (file.type === "video/mp4") {
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, url]);
      } else {
        setPreviewUrls((prev) => [...prev, ""]);
      }
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    form.setValue("file", newFiles);
  };

  async function onSubmit(values: z.infer<typeof postValidation>) {
    try {
      const postVariables = {
        userId: user.id,
        ...values,
      };
      const newPost = await createPost(postVariables);
      if (!newPost) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        form.reset();
      } else {
        toast({
          variant: "default",
          title: "Your post is shared successfully!",
        });
        onPostCreated?.();
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

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
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div
                      className="border-2 border-dashed border-primary-500 rounded-lg p-6 text-center cursor-pointer hover:border-primary-600 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-primary-500 mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        Drag & Drop your files or{" "}
                        <span className="text-primary-500 underline">
                          Browse
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload up to 5 files (JPEG, PNG, MP4 only)
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,video/mp4"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {files.length > 0 && (
                      <div className="space-y-4">
                        <Carousel className="w-full border rounded-md">
                          <CarouselContent>
                            {files.map((file, index) => (
                              <CarouselItem key={index}>
                                <div className="relative">
                                  <div className="aspect-video flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">
                                    {file.type.startsWith("image/") ? (
                                      <img
                                        src={
                                          previewUrls[index] ||
                                          "/placeholder.svg"
                                        }
                                        alt={`Preview ${index + 1}`}
                                        className="max-h-[500px] object-cover w-full min-h-[25rem]"
                                        loading="lazy"
                                      />
                                    ) : file.type.startsWith("video/") ? (
                                      <video
                                        src={previewUrls[index]}
                                        controls
                                        playsInline
                                        crossOrigin="anonymous"
                                        className="max-h-[500px] w-full min-h-[25rem] object-cover"
                                      />
                                    ) : (
                                      <div className="text-center">
                                        <div className="text-4xl mb-2">📄</div>
                                        <p className="text-sm text-gray-600">
                                          {file.name}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                  {files.length > 1 && (
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                      {index + 1} / {files.length}
                                    </div>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          {files.length > 1 && <CarouselPrevious />}
                          {files.length > 1 && <CarouselNext />}
                        </Carousel>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
            {postIsPending && <div className=" animate-spin"> ⚽</div>}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default IsPostForm;
