"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, loginFormSchema } from "@/lib/validation/auth";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState("");
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const router = useRouter();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          console.log(data);
          try {
            const res = await signIn("credentials", {
              redirect: false,
              email: data.email,
              password: data.password,
            });
            console.log(res);

            if (!res?.error) {
              router.push("/?success=true");
            }
          } catch (e) {
            console.log(e);
            setError(e)
          }
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="inline-flex justify-between items-center w-full">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting" : "Submit"}
          </Button>
          <p className="text-rose-500 text-sm dark:text-rose-400">{error}</p>
        </div>
      </form>
    </Form>
  );
}
