"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { id } from "zod/v4/locales";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import * as z from "zod";
import { Address } from "../addresses/page";

const states = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
] as const;
export const addressSchema = z.object({
  phone: z.string().min(10, "Invalid phone number").max(15),
  house: z.string().min(1, "House is required"),
  road: z.string().min(1, "Area is required"),
  pincode: z.string().length(6, "Invalid pincode"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  nearby: z.string().min(1, "Landmark is required"),
});
type Props = {
  id: string;
  address: Address[];
  setAddress: React.Dispatch<React.SetStateAction<Address[]>>;
};
export function DialogDemo({ id, setAddress, address }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const router = useRouter();

  const saveAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      phone: String(formData.get("phone") ?? ""),
      house: String(formData.get("house") ?? ""),
      road: String(formData.get("road") ?? ""),
      nearby: String(formData.get("nearby") ?? ""),
      pincode: String(formData.get("pincode") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
    };
    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])
        )
      );
      return;
    } else {
      setLoading(true);

      const response = await axios.post("/api/userprofile/addaddress", {
        id,
        phone: data.phone,
        house: data.house,
        road: data.road,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        nearby: data.nearby,
      });
      if (response.data.success) {
        setAddress([
          ...address,
          {
            phoneNumber: data.phone,
            houseNumber: data.house,
            area: data.road,
            pincode: data.pincode,
            city: data.city,
            state: data.state,
            nearby: data.nearby,
            isDefault: true,
          },
        ]);
      } else console.log("error", response.data.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="default">
          Add Address
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {/* The form must wrap everything inside DialogContent */}
        <form onSubmit={saveAdd}>
          <DialogHeader>
            <DialogTitle>Add Address</DialogTitle>
            <DialogDescription>
              Fill in the details below to save your new address.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="81238XXXXX"
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="house">House no./Building Name</Label>
              <Input id="house" name="house" required />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.house}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="road">Road name/Area/Colony</Label>
              <Input id="road" name="road" required />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.road}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nearby">Nearby/Landmarks</Label>
              <Input id="nearby" name="nearby" required />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.road}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" required />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.pincode}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                name="state"
                defaultValue=""
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  Select State
                </option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            {loading ? (
              <Button disabled={true}>
                Wait <Loader className="animate-spin" />
              </Button>
            ) : (
              <Button className="cursor-pointer" type="submit">
                Save Address
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
