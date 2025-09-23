import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const loginFormSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
        rememberMe: false,
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onResponse() {
          setIsSubmitting(false);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm mx-auto py-10 font-poppins">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-0">
                  <FormLabel className="mb-1">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button variant="link" size={"sm"}>
                Forgot password?
              </Button>
            </div>
          </div>

          <Button isLoading={isSubmitting} className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>

      <div className="w-full flex items-center justify-center relative">
        <div className="w-full h-[0.5px] bg-muted-foreground absolute" />
        <p className="bg-background z-10 text-sm px-4">Or Login with</p>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Button variant={"outline"} className="flex-1">
          <img
            src="/google-icon.svg"
            alt="Google Icon"
            className="w-5 h-5 object-contain"
          />
          Google
        </Button>
        <Button variant={"outline"} className="flex-1">
          <img
            src="/apple.svg"
            alt="Google Icon"
            className="w-5 h-5 object-contain"
          />
          Apple
        </Button>
      </div>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup">
          <Button variant={"link"} className="px-0">
            Signup now
          </Button>
        </Link>
      </p>
    </div>
  );
}
