"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SkeletonCard from "../components/Skeleton";
import { Button } from "@/components/ui/button";
import { DialogDemo } from "../components/Dialog";
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
    const response = await axios.get(
      `/api/userprofile/fetchaddress/${userid}/`
    );
    console.log("Addresses are: ", response);
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
        <DialogDemo />
      </div>
    );
  }
  return <div className="h-screen w-screen">hey your address is this</div>;
}
