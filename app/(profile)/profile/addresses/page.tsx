"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SkeletonCard from "../components/Skeleton";
import { Button } from "@/components/ui/button";
import { DialogDemo } from "../components/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
type Address = {
  phoneNumber: string;
  houseNumber: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  nearby: string;
  isDefault: boolean;
};
export default function Address() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //@ts-ignore
  const userid = session?.user.id;
  async function fetchAddress() {
    setLoading(true);
    const response = await axios.get(`/api/userprofile/fetchaddress/`);
    console.log("Addresses are: ", response.data.response);
    setAddress(response.data.response);
    setLoading(false);
  }
  useEffect(() => {
    if (status === "authenticated") fetchAddress();
  }, [status]);

  if (loading) return <SkeletonCard />;
  if (!loading && address.length === 0) {
    return (
      <div className=" h-full w-full gap-10 flex flex-col justify-center items-center">
        <h2 className="text-5xl">No address found</h2>

        <DialogDemo
          //@ts-ignore
          id={session?.user.id}
        />
      </div>
    );
  }
  if (address.length >= 1)
    return (
      <div className="h-screen w-screen">
        {address.map((address) => (
          <Card className="m-10 max-w-md rounded-xl border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Delivery Address
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Address */}
              <div className="text-sm leading-relaxed text-foreground">
                <p className="font-medium">House No: {address.houseNumber}</p>
                <p>{address.area}</p>
                <p>
                  {address.city}, {address.state} – {address.pincode}
                </p>
                {address.nearby && (
                  <p className="text-muted-foreground">Near {address.nearby}</p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Phone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{address.phoneNumber}</span>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="m-10 cursor-pointer">
          <DialogDemo />
        </div>
      </div>
    );
}
