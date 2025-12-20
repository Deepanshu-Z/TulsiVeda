import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Replies } from "../submitticket/page";

type Props = {
  mails: Mail[];
  replies: Replies[];
  setMails: React.Dispatch<React.SetStateAction<Mail[]>>;
  setReplies: React.Dispatch<React.SetStateAction<Replies[]>>;
};
export default function AllMails({
  mails,
  replies,
  setMails,
  setReplies,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const getAllData = async () => {
    setLoading(true);

    const mails = await axios.get("/api/email/get/auth");
    if (mails.data.success) {
      setMails(mails.data.mails);
    } else {
      console.log("error fetching mails");
      setMails([]);
    }

    const replies = await axios.get("/api/replies/get/auth");
    if (replies.data.success) {
      setReplies(replies.data.replies);
    } else {
      console.log("error fetching replies");
      setReplies([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Previous Messages</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {mails.map((mail, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition"
          >
            <div className="space-y-1">
              <p className="font-medium">{mail.subject}</p>
              <p className="text-sm text-muted-foreground">{mail.email}</p>
            </div>

            <div className="flex flex-col gap-4">
              <Badge variant="secondary">{mail.status}</Badge>
              <Badge variant="secondary">
                {new Date(mail.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
