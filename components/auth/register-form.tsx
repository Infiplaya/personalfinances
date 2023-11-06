'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

import { registerUser } from '@/db/actions/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm, registerFormSchema } from '@/lib/validation/auth';
import { toast } from 'sonner';

export function RegisterForm() {
  const [error] = useState('');
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const result = await registerUser(data);
          if (result.success) {
            router.push('/signin?registration-success=true');
          } else {
            toast.error(result.error);
          }
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
        <div className="inline-flex w-full items-center justify-between">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting' : 'Submit'}
          </Button>
          <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>
        </div>
      </form>
    </Form>
  );
}
