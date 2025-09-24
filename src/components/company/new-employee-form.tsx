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
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Id } from "convex/_generated/dataModel";
import { showErrorMessage } from "@/lib/utils";

export const newEmployeeFormSchema = z.object({
  companyId: z.string().min(1, "Employee name is required"),
  name: z.string().min(1, "Employee name is required"),
  userEmail: z.string().email("Employee email is required"),
  role: z.union([z.literal("manager"), z.literal("employee")]),
});

export function NewEmployeeForm() {
  const { companyId } = useParams({ from: "/company/$companyId" });

  const inviteEmployee = useMutation(api.memberships.sendInvite);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof newEmployeeFormSchema>>({
    resolver: zodResolver(newEmployeeFormSchema),
    defaultValues: {
      companyId,
      name: "",
      userEmail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newEmployeeFormSchema>) {
    setIsSubmitting(true);

    try {
      await inviteEmployee({
        companyId: companyId as Id<"companies">,
        name: values.name,
        role: values.role,
        userEmail: values.userEmail,
      });

      toast.success(`Invite sent to ${values.userEmail}`);
      form.reset();
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full font-poppins">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">Employee Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">Employee Email*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">Employee Role*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="font-poppins">
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button isLoading={isSubmitting} className="w-full" type="submit">
            Invite Employee
          </Button>
        </form>
      </Form>
    </div>
  );
}
