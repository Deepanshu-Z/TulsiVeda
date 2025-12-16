"use client";

import { useSession } from "next-auth/react";
import SkeletonCard from "../components/Skeleton";

export default function Orders() {
  const { data: session, status } = useSession();
  if (status === "loading") return <SkeletonCard />;
  return <div className="">orders</div>;
}
