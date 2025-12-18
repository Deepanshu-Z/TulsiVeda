"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { PopoverDemo } from "./components/Popup";
import SkeletonCard from "../components/Skeleton";

type UserProfileProps = {
  name: string;
  email: string;
  image?: string | null;
  role: null | "admin" | "user";
  phone?: string | null;
  createdAt: string;
  lastLogin?: string | null;
};

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfileProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchUser = async () => {
    setLoading(true);
    const response = await axios.get("/api/userprofile/getuserdetails");
    setUser({
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      image: session?.user?.image ?? null,
      role: response.data.user[0].role,
      phone: response.data.user[0].phone, // fetch later if stored separately
      createdAt: response.data.user[0].createdAt.toLocaleString(),
      lastLogin: new Date().toLocaleString(),
    });
    setLoading(false);
  };
  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  const addContact = () => {};
  if (loading) return <SkeletonCard />;
  return (
    <div className="w-full h-full p-6">
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-xl font-semibold">
              {user?.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1">
              {user?.role === "admin" ? "admin" : "user"}
            </Badge>
          </div>

          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
          >
            Logout
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 mt-4">
          {/* Contact */}
          <section className="space-y-2">
            <h3 className="font-semibold">Contact</h3>
            <p className="text-sm text-muted-foreground">
              {user?.phone ? (
                <div>
                  Phone: <p>{user?.phone}</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  No contact found:
                  <PopoverDemo />
                </div>
              )}
            </p>
          </section>

          <Separator />

          {/* Addresses */}
          <section className="space-y-2">
            <h3 className="font-semibold">Addresses</h3>
            <p className="text-sm text-muted-foreground">
              Manage your saved delivery addresses
            </p>
            <Link href={"/profile/addresses"}>
              <Button variant={"outline"} size="sm">
                Manage Addresses
              </Button>
            </Link>
          </section>

          <Separator />

          {/* Account */}
          <section className="space-y-2">
            <h3 className="font-semibold">Account</h3>
            <p className="text-sm text-muted-foreground">
              Created: {user?.createdAt}
            </p>
            {user?.lastLogin && (
              <p className="text-sm text-muted-foreground">
                Last login: {user?.lastLogin}
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
