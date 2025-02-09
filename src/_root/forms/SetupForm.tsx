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
import { formSchema } from "@/lib/validation";

interface SetupFormProps {
  user: {
    name: string;
    bio: string;
    tags: string[];
    favPosition?: string;
  };
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function SetupForm({ user, onSubmit }: SetupFormProps) {
  const [tags, setTags] = useState<string[]>(user?.tags || []);
  const [newTag, setNewTag] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio,
      favPosition: user.favPosition,
    },
  });

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
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-end">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New tag"
                      {...field}
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="shad-button_primary hover:shad-button_ghost"
              onClick={() => {
                if (!newTag.trim()) return;
                const updatedTags = [...tags, newTag.trim()];
                setTags(updatedTags); // ✅ Updates state
                form.setValue("tags", updatedTags); // ✅ Uses updated array
                setNewTag("");
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center p-2 border border-slate-200 rounded-lg"
              >
                <p className="mr-2">{tag}</p>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => {
                    const updatedTags = tags.filter((_, i) => i !== index);
                    setTags(updatedTags);
                    form.setValue("tags", updatedTags);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <FormField
          control={form.control}
          name="favPosition"
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
