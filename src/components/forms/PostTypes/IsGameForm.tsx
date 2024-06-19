import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
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
import { Input } from "../../ui/input";
import { useGetCities } from "@/lib/react-query/queriesAndMutations";
import { gameValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
const IsGameForm = () => {
  const { data: governorates } = useGetCities();
  const [cities, setCities] = useState([]);
  const form = useForm<z.infer<typeof gameValidation>>({
    resolver: zodResolver(gameValidation),
    defaultValues: {
      caption: "",
      playersNumber: 1,
      governorate: "",
      city: "",
      playgroundName: "",
      privacy: "public",
    },
  });

  function onSubmit(values: z.infer<typeof gameValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("wtf");
    console.log(values);
  }
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
                <FormItem>
                  <FormLabel>Governorate</FormLabel>
                  <Select
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
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
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
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key={1} value={"public"}>
                        Public
                      </SelectItem>
                      <SelectItem key={2} value={"friends only"}>
                        Friends Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="playgroundName"
            render={({ field }) => (
              <FormItem>
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
          <Button
            type="submit"
            className="self-center w-1/2 p-4 my-3 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
          >
            Post
          </Button>
        </form>
      </Form>
    </>
  );
};

export default IsGameForm;
