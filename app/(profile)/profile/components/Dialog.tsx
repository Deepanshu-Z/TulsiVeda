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

export function DialogDemo(id: any) {
  const saveAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      phone: formData.get("phone"),
      house: formData.get("house"),
      road: formData.get("road"),
      nearby: formData.get("nearby"),
      pincode: formData.get("pincode"),
      city: formData.get("city"),
      state: formData.get("state"),
    };

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
    if (response.data.success) console.log("Successfully added");
    else console.log("error", response.data.error);
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="house">House no./Building Name</Label>
              <Input id="house" name="house" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="road">Road name/Area/Colony</Label>
              <Input id="road" name="road" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nearby">Nearby/Landmarks</Label>
              <Input id="nearby" name="nearby" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
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
            <Button className="cursor-pointer" type="submit">
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
