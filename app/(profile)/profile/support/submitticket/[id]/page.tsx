"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
      `/api/userprofile/chats?ticketId=${ticketId}`
    );
    console.log(data.chats);
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
    });
    setBtnLoading(false);
    setContent("");
  };

  return (
    <div className="flex flex-col h-[90%]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {chats.map((c, i) => (
          <div
            key={c.id}
            className={`flex  ${
              c.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                c.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {c.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2 border-t p-3">
        <Input
          onChange={(e) => setContent(e.target.value)}
          placeholder="Send message"
          className="flex-1"
          value={content}
        />
        <Button className="w-20" onClick={() => sendMail(content)}>
          {btnLoading ? <Loader className="animate-spin" /> : "Send"}
        </Button>
      </div>
    </div>
  );
}
