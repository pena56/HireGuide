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
import { getAddressFromCoords, getUserLocation } from "@/lib/location";
import { AddressCombobox } from "../location-combobox";
import { LocateIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { showErrorMessage } from "@/lib/utils";

export const newCompanyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Company Location is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  logo: z.string().optional(),
});

export function NewCompanyForm() {
  const generateUploadUrl = useMutation(api.utils.generateUploadImageUrl);
  const createCompany = useMutation(api.companies.createCompany);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUserLocation, setLoadingUserLocation] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof newCompanyFormSchema>>({
    resolver: zodResolver(newCompanyFormSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newCompanyFormSchema>) {
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

        const company = await createCompany({
          latitude: values.latitude ?? "",
          location: values.location,
          longitude: values.longitude ?? "",
          name: values.name,
          logo: storageId,
        });

        toast.success("Company created successfully");

        navigate({
          to: "/company/$companyId",
          params: {
            companyId: company,
          },
        });
      } catch (error) {
        showErrorMessage(error);
      }
    } else {
      try {
        const company = await createCompany({
          latitude: values.latitude ?? "",
          location: values.location,
          longitude: values.longitude ?? "",
          name: values.name,
        });

        toast.success("Company created successfully");

        navigate({
          to: "/company/$companyId",
          params: {
            companyId: company,
          },
        });
      } catch (error) {
        showErrorMessage(error);
      } finally {
        setIsSubmitting(false);
      }
    }

    form.reset();
  }

  const handleOnGetCurrentLocation = () => {
    setLoadingUserLocation(true);
    getUserLocation()
      .then((data) => {
        getAddressFromCoords(data?.latitude, data?.longitude)
          .then((res) => {
            form.setValue("location", res, {
              shouldValidate: true,
            });
            form.setValue("latitude", String(data?.latitude));
            form.setValue("longitude", String(data?.longitude));

            setLoadingUserLocation(false);
          })
          .catch(() => {
            setLoadingUserLocation(false);
          });
      })
      .catch(() => {
        setLoadingUserLocation(false);
        toast.error("Something went wrong getting your current location.");
      });
  };

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
                <FormLabel className="mb-1">Company Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-0">
                <FormLabel className="mb-1">Company Location*</FormLabel>
                <FormControl>
                  <div className="w-full flex items-center space-x-2">
                    <div className="w-[calc(100%-48px)]">
                      <AddressCombobox
                        value={field.value}
                        onAddressSelect={(val) => {
                          form.setValue("location", val.description, {
                            shouldValidate: true,
                          });

                          if (val.lat && val.lng) {
                            form.setValue("latitude", String(val.lat), {
                              shouldValidate: true,
                            });

                            form.setValue("longitude", String(val.lng), {
                              shouldValidate: true,
                            });
                          }
                        }}
                        placeholder="Company Location"
                      />
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          className="aspect-square"
                          variant={"outline"}
                          onClick={handleOnGetCurrentLocation}
                          isLoading={loadingUserLocation}
                        >
                          <LocateIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-poppins">Use my Current location</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={() => (
              <FormItem className="w-full flex flex-col gap-0">
                <FormLabel className="mb-1">Company Logo (Optional):</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select Logo..."
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
            Create Company
          </Button>
        </form>
      </Form>
    </div>
  );
}
