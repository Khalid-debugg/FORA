import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ResetPasswordValidation } from "@/lib/validation";
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
import { useCreateRecovery } from "@/lib/react-query/queriesAndMutations/users";
const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: sendRecovery } = useCreateRecovery();
  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof ResetPasswordValidation>) {
    try {
      const response = await sendRecovery(values.email);
      if (response instanceof Error) throw new Error(response.message);
      toast({
        variant: "default",
        title: "Check your email to reset your password",
      });
      form.reset();
      navigate("/signin");
    } catch (error) {
      toast({
        variant: "error",
        title: error.message,
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
          className="flex flex-col justify-center gap-5 w-1/2"
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
          <Button
            type="submit"
            className="shad-button_primary hover:shad-button_ghost"
          >
            <p>Reset Password</p>
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

export default ResetPassword;
