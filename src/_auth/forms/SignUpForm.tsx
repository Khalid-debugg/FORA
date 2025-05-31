import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateNewAccount,
  useCreateNewSession,
} from "@/lib/react-query/queriesAndMutations/users";
import { useGetCities } from "@/lib/react-query/queriesAndMutations/games";

const SignUpForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isSigningUp } =
    useCreateNewAccount();
  const { mutateAsync: createLoginSession } = useCreateNewSession();
  const { data: governorates } = useGetCities();
  const [cities, setCities] = useState([]);

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      governorate: "",
      city: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const accountStatus = await createUserAccount(values);
      if (accountStatus instanceof Error)
        throw new Error(accountStatus.message);

      toast({
        variant: "default",
        title: "Your account is created successfully!",
      });

      const sessionStatus = await createLoginSession({
        email: values.email,
        password: values.password,
      });

      if (sessionStatus instanceof Error)
        throw new Error(sessionStatus.message);

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate("/");
      }
    } catch (error) {
      form.reset();
      let errorMessage = "Sign up failed, please try again";
      if (error instanceof Error) errorMessage = error.message;
      toast({
        variant: "error",
        title: "Uh oh! something wrong happened",
        description: errorMessage || "",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center flex-col gap-16 h-screen">
        <img
          src="/assets/brand-logo/svg/logo-no-background.svg"
          alt="FORA Logo"
          className="w-[300px]"
          loading="lazy"
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-3 w-10/12 md:w-1/2"
        >
          <div className="flex flex-wrap gap-3 w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      type="text"
                      className="shad-input "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      type="text"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe"
                    type="text"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-3">
            <FormField
              control={form.control}
              name="governorate"
              render={() => (
                <FormItem className="flex-1">
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
                      setCities(currentGov?.cityDataModels || []);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a governorate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {governorates?.map(
                        (gov: { id: number; namePrimaryLang: string }) => (
                          <SelectItem key={gov.id} value={gov.namePrimaryLang}>
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
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <Select
                    value={form.watch("city")}
                    onValueChange={field.onChange}
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
          <Button
            type="submit"
            className="shad-button_primary hover:shad-button_ghost"
          >
            <p>Sign Up</p>
            {isSigningUp && <div className=" animate-spin">⚽</div>}
          </Button>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary-500 underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
