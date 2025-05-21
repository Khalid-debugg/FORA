import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SetNewPasswordValidation } from "@/lib/validation";
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
import { useUpdateRecovery } from "@/lib/react-query/queriesAndMutations/users";
const SetNewPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userId = new URLSearchParams(useLocation().search).get("userId");
  const secret = new URLSearchParams(useLocation().search).get("secret");
  const { mutateAsync: updateRecovery } = useUpdateRecovery();
  const form = useForm<z.infer<typeof SetNewPasswordValidation>>({
    resolver: zodResolver(SetNewPasswordValidation),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SetNewPasswordValidation>) {
    try {
      const response = await updateRecovery({
        userId,
        secret,
        newPassword: values.password,
      });
      if (response instanceof Error) throw new Error(response.message);
      else {
        toast({
          variant: "default",
          title: "Your password is updated successfully!",
        });
        form.reset();
        navigate("/signin");
      }
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
        />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-5 w-1/2"
        >
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
          <Button
            type="submit"
            className="shad-button_primary hover:shad-button_ghost"
          >
            <p>Set new password</p>
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default SetNewPassword;
