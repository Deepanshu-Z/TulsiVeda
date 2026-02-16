"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
type Chat = {
  id: string;
  content: string;
  createdAt: string;
  role: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const params = useParams();
  const ticketId = params.id as string;
  const [chats, setChats] = useState<Chat[]>([]);
  const userEmail = session?.user?.email;
  const [content, setContent] = useState("");
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const fetchChats = async () => {
    const { data } = await axios.get(
      `/api/userprofile/chats?ticketId=${ticketId}`,
    );
    setChats(data.chats);
  };

  useEffect(() => {
    if (status === "authenticated" && ticketId) {
      fetchChats();
    }
  }, [status, ticketId]);

  const sendMail = async (content: any) => {
    setChats((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content,
        createdAt: new Date().toISOString(),
        role: "user",
      },
    ]);

    setBtnLoading(true);
    const response = await axios.post("/api/email/send/auth", {
      ticketId,
      userEmail,
      content,
      role: "user",
    });
    if (response.status === 429) {
      toast("Too many requests. Please wait 1 minute.", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#dc2626", // red
          color: "#fff",
          fontWeight: "500",
        },
        icon: "⏳",
      });
    }

    setBtnLoading(false);
    setContent("");
  };

  return (
    <div className="flex flex-col h-[90%]">
      {/* Conversation timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((c) => (
          <div
            key={c.id}
            className={`border rounded-md p-4 text-sm ${
              c.role === "user"
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-blue-200"
            }`}
          >
            {/* Meta */}
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{c.role === "user" ? "Customer" : "Admin Reply"}</span>
              {c.createdAt && (
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              )}
            </div>

            {/* Message */}
            <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
          </div>
        ))}
      </div>

      {/* Reply section */}
      <div className="border-t bg-gray-50 p-4">
        <div className="text-xs text-gray-500 mb-2">
          Reply to Admin (email will be sent)
        </div>

        <div className="flex gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1"
          />
          <Button
            className="w-28"
            onClick={() => sendMail(content)}
            disabled={btnLoading}
          >
            {btnLoading ? <Loader className="animate-spin" /> : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
}
