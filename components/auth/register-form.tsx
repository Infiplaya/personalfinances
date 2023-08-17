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
import { Category } from "@/db/schema/finances";

import { registerUser } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, registerFormSchema } from "@/lib/validation/auth";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const { error } = await registerUser(data);
          if (error) {
            console.log(error);
          } else {
            signIn(undefined, { callbackUrl: "/signin" });
          }
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
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
