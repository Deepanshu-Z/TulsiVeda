"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function AppSidebar() {
  const [active, setActive] = useState<string>("orders");
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <Button className="cursor-pointer">
              <ArrowLeft />
            </Button>
          </Link>
          <h2>Home</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link href={"/profile/orders"}>
            {active === "orders" ? (
              <Button variant={"secondary"} className="w-full cursor-pointer">
                My orders
              </Button>
            ) : (
              <Button
                onClick={() => setActive("orders")}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                My orders
              </Button>
            )}
          </Link>
        </SidebarGroup>

        <SidebarGroup>
          <Link href={"/profile/details"}>
            {active === "details" ? (
              <Button variant={"secondary"} className="w-full cursor-pointer">
                My Details
              </Button>
            ) : (
              <Button
                onClick={() => setActive("details")}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                My Details
              </Button>
            )}
          </Link>
        </SidebarGroup>

        <SidebarGroup>
          <Link href={"/profile/addresses"}>
            {active === "addresses" ? (
              <Button variant={"secondary"} className="w-full cursor-pointer">
                My addresses
              </Button>
            ) : (
              <Button
                onClick={() => setActive("addresses")}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                My addresses
              </Button>
            )}
          </Link>
        </SidebarGroup>

        <SidebarGroup>
          <Link href={"/profile/returns"}>
            {active === "returns" ? (
              <Button variant={"secondary"} className="w-full cursor-pointer">
                Returns
              </Button>
            ) : (
              <Button
                onClick={() => setActive("returns")}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                Returns
              </Button>
            )}
          </Link>
        </SidebarGroup>

        <SidebarGroup>
          <Link href={"/profile/support"}>
            {active === "support" ? (
              <Button variant={"secondary"} className="w-full cursor-pointer">
                Contact support
              </Button>
            ) : (
              <Button
                onClick={() => setActive("support")}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                Contact support
              </Button>
            )}
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>My Profile</SidebarFooter>
    </Sidebar>
  );
}
