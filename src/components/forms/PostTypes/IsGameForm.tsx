import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../../ui/input";
import { gameValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { z } from "zod";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  useCreateGame,
  useGetCities,
} from "@/lib/react-query/queriesAndMutations/games";

const IsGameForm = ({ onPostCreated }: { onPostCreated?: () => void }) => {
  const { toast } = useToast();
  const { user } = useUserContext();
  const { data: governorates } = useGetCities();
  const { mutateAsync: createGame, isPending: postIsPending } = useCreateGame();
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof gameValidation>>({
    resolver: zodResolver(gameValidation),
    defaultValues: {
      caption: "",
      playersNumber: 1,
      governorate: "",
      city: "",
      playgroundName: "",
      dateTime: "",
    },
  });
  async function onSubmit(values: z.infer<typeof gameValidation>) {
    try {
      const postVariables = {
        userId: user.id,
        ...values,
      };

      const newPost = await createGame(postVariables);
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
          title: "Your game is shared successfully!",
        });
        onPostCreated?.(); // Close the dialog
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <h2 className="self-center font-[600] bg-gradient-to-br from-green-700 to-primary-500 p-3 rounded-md text-white text-center">
            Gather your friends and play football ⚽
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
            name="playersNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of players</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="outline outline-1 outline-primary-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex md:justify-start flex-wrap gap-3">
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem className="flex-1 w-1/2">
                  <FormLabel>Governorate</FormLabel>
                  <Select
                    value={form.watch("governorate")}
                    onValueChange={(value: string) => {
                      form.setValue("city", "");
                      form.setValue("governorate", value);
                      const currentGov = governorates?.find(
                        (gov: { id: number; namePrimaryLang: string }) =>
                          gov.namePrimaryLang === value,
                      );
                      setCities(currentGov.cityDataModels);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a governorate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {governorates &&
                        governorates.map(
                          (gov: { id: number; namePrimaryLang: string }) => (
                            <SelectItem
                              key={gov.id}
                              value={gov.namePrimaryLang}
                            >
                              {gov.namePrimaryLang}
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1 w-1/2">
                  <FormLabel>City</FormLabel>
                  <Select
                    value={form.watch("city")}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={cities.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map(
                        (city: { id: number; namePrimaryLang: string }) => (
                          <SelectItem
                            key={city.id}
                            value={city.namePrimaryLang}
                          >
                            {city.namePrimaryLang}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:justify-start flex-wrap gap-3 items-end">
            <FormField
              control={form.control}
              name="playgroundName"
              render={({ field }) => (
                <FormItem className="flex-1 w-1/2">
                  <FormLabel>Playground's name</FormLabel>
                  <FormControl>
                    <Input
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
              name="dateTime"
              render={({ field }) => (
                <FormItem className="flex-1 w-1/2">
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="outline outline-1 outline-primary-500"
                      min={getCurrentDateTime()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

export default IsGameForm;
