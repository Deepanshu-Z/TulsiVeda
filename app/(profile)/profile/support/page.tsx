"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  subject: string;
  content: string;
};

export default function App() {
  const { data: session, status } = useSession();
  //@ts-ignore
  const userId = session?.user.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const response = await axios.post("/api/email/send/auth", {
      userEmail: data.email,
      userId,
      subject: data.subject,
      content: data.content,
      isVerified: true,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input placeholder="example@gmail.com" {...register("email")} />
          {errors.email && <span>Email</span>}
        </div>
        <div>
          <input placeholder="subject" {...register("subject")} />
          {errors.subject && <span>subject</span>}
        </div>

        <div>
          <input placeholder="content" {...register("content")} />
          {errors.content && <span>content</span>}
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
