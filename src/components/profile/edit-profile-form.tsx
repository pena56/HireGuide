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
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { showErrorMessage } from "@/lib/utils";

export const editProfileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
});

export function EditProfileForm() {
  const generateUploadUrl = useMutation(api.utils.generateUploadImageUrl);
  const profile = useQuery(api.profile.getProfile);
  const editProfile = useMutation(api.profile.editProfile);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: profile?.name,
      image: profile?.image,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileFormSchema>) {
    setIsSubmitting(true);
    if (selectedImage) {
      try {
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage!.type },
          body: selectedImage,
        });

        const { storageId } = await result.json();

        await editProfile({
          name: values.name,
          image: storageId,
        });

        toast.success("Profile Updated Successfully");

        navigate({
          to: "/",
        });
      } catch (error) {
        showErrorMessage(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        await editProfile({
          name: values.name,
          image: profile?.image,
        });

        toast.success("Profile Updated Successfully");

        navigate({
          to: "/",
        });
      } catch (error) {
        showErrorMessage(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-md mx-auto py-10 font-poppins">
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
                <FormLabel className="mb-1">Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">
                  Profile Image (Optional):
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select Profile Image..."
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setSelectedImage(event.target.files![0])
                    }
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button isLoading={isSubmitting} className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
