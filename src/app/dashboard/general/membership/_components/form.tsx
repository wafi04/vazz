"use client";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { membershipCreate } from "@/types/schema/membership";

export type membershipCreate = z.infer<typeof membershipCreate>;

interface FormMembershipProps {
  initialData?: membershipCreate;
  id?: number;
  isLoading: boolean;
  onSubmit: (values: membershipCreate) => void;
}

export function FormMembership({
  initialData,
  id,
  isLoading,
  onSubmit,
}: FormMembershipProps) {
  const form = useForm<membershipCreate>({
    resolver: zodResolver(membershipCreate),
    defaultValues: initialData || {
      benefit: "" as string,
      description: "",
      name: "",
      price: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter membership name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the membership package
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Benefits Field */}
        <FormField
          control={form.control}
          name="benefit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the benefits (separate with commas)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  inputMode="numeric"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {id ? "Update Membership" : "Create Membership"}
        </Button>
      </form>
    </Form>
  );
}
