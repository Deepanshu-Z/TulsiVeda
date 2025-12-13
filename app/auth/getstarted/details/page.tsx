"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateUserName } from "./action";

export default function Page() {
  const [uname, setUname] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (status === "authenticated") {
            const response = await updateUserName(session?.user?.email!, uname);

            if (response.success) {
              setErrorMsg("");
              router.replace("/");
            } else {
              setErrorMsg("Please retry: Internal Server Error");
            }
          }
        }}
        className="max-w-92 m-auto h-fit w-full"
      >
        <div className="p-6">
          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Before we get started
          </h1>
          <p>Please enter your Full Name</p>

          <div className="pt-5 space-y-6">
            <div className="space-y-2">
              <Input
                onChange={(e) => setUname(e.target.value)}
                type="text"
                required
                name="name"
                id="name"
                className="border-2"
              />

              {/* ✔ Correct conditional rendering */}
              {errorMsg && (
                <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
