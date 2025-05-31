import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
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
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useCreateNewSession } from "@/lib/react-query/queriesAndMutations/users";
const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createLoginSession, isPending: isLoggingIn } =
    useCreateNewSession();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    try {
      const sessionStatus = await createLoginSession({
        email: values.email,
        password: values.password,
      });

      if (sessionStatus instanceof Error)
        throw new Error(sessionStatus.message);
      else {
        toast({
          variant: "default",
          title: "Your account is logged in successfully!",
        });
      }
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
          className="flex flex-col justify-center gap-5 w-10/12 md:w-1/2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                <div className="flex w-full items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    className="text-primary-500 underline text-sm"
                    to={"/reset-password"}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    autoComplete="on"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary hover:shad-button_ghost"
          >
            <p>Sign in</p>
            {isLoggingIn && <div className=" animate-spin">⚽</div>}
          </Button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignInForm;
