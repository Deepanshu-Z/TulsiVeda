"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AllMails from "../components/Allmails";
import { useState } from "react";
import { Loader } from "lucide-react";
export type Mail = {
  subject: string;
  email: string;
  content: string;
  createdAt: string;
  status: string;
};

export type Replies = {
  subject: string;
  content: string;
  repliedAt: string;
};
const Inputs = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),

  subject: z.string().min(3, "Subject too short").max(120, "Subject too long"),

  content: z
    .string()
    .min(10, "Message too short")
    .max(2000, "Message too long"),
});
type Schema = z.infer<typeof Inputs>;

export default function App() {
  const [mails, setMails] = useState<Mail[]>([]);
  const [replies, setReplies] = useState<Replies[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  //@ts-ignore
  const userId = session?.user.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Inputs),
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    const response = await axios.post("/api/email/send/auth", {
      userEmail: data.email,
      userId,
      subject: data.subject,
      content: data.content,
      isVerified: true,
    });

    if (response.data.success) location.reload();
    else console.log("Error sending mail");

    setLoading(false);
  };

  return (
    <div>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-center">Contact Support</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                placeholder="example@gmail.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Subject</Label>
              <Input
                placeholder="Subject"
                {...register("subject", { required: true })}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Message</Label>
              <Textarea
                placeholder="Write your message..."
                {...register("content", { required: true })}
              />
              {errors.content && (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {loading ? (
                <span>
                  <Loader className="animate-spin" />
                </span>
              ) : (
                <span>Send Message</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AllMails
        mails={mails}
        replies={replies}
        setMails={setMails}
        setReplies={setReplies}
      />
    </div>
  );
}
