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
          <div key={i}>
            <p>{c.content}</p>
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
