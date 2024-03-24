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
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateNewAccount,
  useCreateNewSession,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isSigningUp } =
    useCreateNewAccount();
  const { mutateAsync: createLoginSession } = useCreateNewSession();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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
      else {
        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
          form.reset();
          navigate("/");
        }
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
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-3"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John_doe"
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
                    placeholder="John.Doe@example.com"
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
                  <Input
                    placeholder="Example1@"
                    type="password"
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
          <Button
            type="submit"
            className="shad-button_primary hover:shad-button_ghost"
          >
            <p>Sign Up</p>
            {isSigningUp && <div className=" animate-spin">⚽</div>}
          </Button>
        </form>
        <p>
          Aleady have an account?{" "}
          <Link to="/signin" className="text-primary-500 underline">
            Sign in
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;
