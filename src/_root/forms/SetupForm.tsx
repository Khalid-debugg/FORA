import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not exceed 160 characters.",
  }),
  profilePicture: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .png, and .webp formats are supported.",
    )
    .optional(),
  coverImage: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .png, and .webp formats are supported.",
    )
    .optional(),
  favoritePosition: z.string().optional(),
});

interface SetupFormProps {
  user: {
    name: string;
    username: string;
    bio: string;
    imageUrl: string;
    coverImageUrl: string;
    favoritePosition?: string;
  };
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function SetupForm({ user, onSubmit }: SetupFormProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user.imageUrl,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    user.coverImageUrl,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio,
      favoritePosition: user.favoritePosition,
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (preview: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (
    setPreview: (preview: string | null) => void,
    fieldName: "profilePicture" | "coverImage",
  ) => {
    setPreview(null);
    form.setValue(fieldName, undefined);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex p-8 flex-col space-y-6 rounded-md bg-white"
      >
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="favoritePosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your favorite position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GK">Goalkeeper (GK)</SelectItem>
                  <SelectItem value="CB">Center Back (CB)</SelectItem>
                  <SelectItem value="LB">Left Back (LB)</SelectItem>
                  <SelectItem value="RB">Right Back (RB)</SelectItem>
                  <SelectItem value="LWB">Left Wing Back (LWB)</SelectItem>
                  <SelectItem value="RWB">Right Wing Back (RWB)</SelectItem>
                  <SelectItem value="CDM">
                    Defensive Midfielder (CDM)
                  </SelectItem>
                  <SelectItem value="CM">Central Midfielder (CM)</SelectItem>
                  <SelectItem value="CAM">
                    Attacking Midfielder (CAM)
                  </SelectItem>
                  <SelectItem value="LM">Left Midfielder (LM)</SelectItem>
                  <SelectItem value="RM">Right Midfielder (RM)</SelectItem>
                  <SelectItem value="LW">Left Winger (LW)</SelectItem>
                  <SelectItem value="RW">Right Winger (RW)</SelectItem>
                  <SelectItem value="ST">Striker (ST)</SelectItem>
                  <SelectItem value="CF">Center Forward (CF)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-1/3 mx-auto shad-button_primary hover:shad-button_ghost transition-all duration-100 ease-in-out"
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
