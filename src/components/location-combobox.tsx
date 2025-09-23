"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";

export interface PlaceT {
  description: string;
  place_id: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
}

export interface AddressComboboxProps {
  onAddressSelect: (address: PlaceT) => void;
  value?: string;
  placeholder?: string;
}

export function AddressCombobox({
  onAddressSelect,
  value,
  placeholder,
}: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<string>("auto");

  React.useLayoutEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        setPopoverWidth(`${triggerRef.current.offsetWidth}px`);
      }
    };

    updateWidth(); // Set initial width

    const resizeObserver = new ResizeObserver(updateWidth);
    if (triggerRef.current) {
      resizeObserver.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        resizeObserver.unobserve(triggerRef.current);
      }
    };
  }, [open]);

  const [inputValue, setInputValue] = React.useState(value || "");
  const [predictions, setPredictions] = React.useState<PlaceT[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  const id = React.useId();

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      const fetchPredictions = async () => {
        try {
          const response = await fetch(
            `/api/places/autocomplete/json?input=${debouncedSearchTerm}`
          );
          const data = await response.json();
          setPredictions(data.predictions || []);
        } catch (error) {
          setPredictions([]); // Clear predictions on error
        } finally {
          setIsLoading(false);
        }
      };

      fetchPredictions();
    } else {
      setPredictions([]);
    }
  }, [debouncedSearchTerm]);

  if (!apiKey) {
    return <p className="text-red-500">API Key for maps is missing.</p>;
  }

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            id={id}
            className="justify-between text-base md:text-sm"
          >
            {value ? (
              <span className="text-ellipsis overflow-hidden">{value}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: popoverWidth }}
          className="p-0 font-poppins"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search address..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {isLoading ? (
                <CommandItem
                  disabled
                  className="p-2 text-center text-sm flex items-center justify-center h-10"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </CommandItem>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {predictions.map((prediction) => (
                      <CommandItem
                        key={prediction.place_id}
                        value={prediction.description}
                        onSelect={async (currentValue) => {
                          setInputValue(currentValue);
                          setOpen(false);

                          try {
                            const response = await fetch(
                              `/api/place-details/json?place_id=${prediction.place_id}&fields=address_component,geometry`
                            );
                            const data = await response.json();

                            let postalCode = "";
                            let lat: number | undefined;
                            let lng: number | undefined;

                            if (data.result) {
                              // Postal Code
                              if (data.result.address_components) {
                                const postalCodeComponent =
                                  data.result.address_components.find(
                                    (component: any) =>
                                      component.types.includes("postal_code")
                                  );
                                if (postalCodeComponent) {
                                  postalCode = postalCodeComponent.long_name;
                                }
                              }

                              // Lat / Lng
                              if (data.result.geometry?.location) {
                                lat = data.result.geometry.location.lat;
                                lng = data.result.geometry.location.lng;
                              }
                            }

                            onAddressSelect({
                              ...prediction,
                              postal_code: postalCode,
                              lat,
                              lng,
                            });
                          } catch (error) {
                            onAddressSelect(prediction);
                          }
                        }}
                        className="font-montserrat font-medium"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            inputValue === prediction.description
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {prediction.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
