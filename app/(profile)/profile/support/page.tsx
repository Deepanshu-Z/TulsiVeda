"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonCard from "../components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Ticket = {
  id: string;
  subject: string;
  createdAt: string;
  status: "pending" | "open" | "completed" | "replied";
};

export default function Page() {
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [input, setInput] = useState("");

  const createTicket = async () => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/userprofile/tickets/createticket",
        { input }
      );

      if (data.success) {
        router.replace(`/profile/support/submitticket/${data.ticketId}`);
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setPageLoading(true);
      const { data } = await axios.get("/api/userprofile/tickets/fetchtickets");
      setTickets(data.tickets ?? []);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (pageLoading) return <SkeletonCard />;

  return (
    <div className="space-y-6">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Contact Support</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="query">Enter your query</Label>

          <Input
            id="query"
            placeholder="Subject"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            onClick={createTicket}
            disabled={btnLoading || !input.trim()}
            className="w-full"
          >
            {btnLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </CardContent>
      </Card>

      {tickets.length === 0 ? (
        <p className="text-center text-muted-foreground">No tickets found</p>
      ) : (
        <div className="max-w-lg mx-auto space-y-3">
          {tickets.map((t) => (
            <Link href={`/profile/support/submitticket/${t.id}`}>
              <Card
                key={t.id}
                className="hover:shadow-md transition cursor-pointer"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize
              ${
                t.status === "open"
                  ? "bg-blue-100 text-blue-700"
                  : t.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : t.status === "replied"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
              }`}
                  >
                    {t.status}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
