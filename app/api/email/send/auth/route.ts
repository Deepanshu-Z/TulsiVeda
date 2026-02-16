import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/mail/email-template";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { chats, ticket } from "@/db/schema";
import { getToken } from "next-auth/jwt";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const values = await req.json();
  const content = values.content;
  const ticketId = values.ticketId;
  const role = values.role;
  const userEmail =
    role == "user" ? "deepanshupokhriyal07@gmail.com" : values.userEmail;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const allowed = await rateLimit(ip);

  if (!allowed) {
    return Response.json(
      { error: "Too many emails. Try again later." },
      { status: 429 },
    );
  }
  if (!userEmail) return Response.json("Unauthenticated", { status: 400 });

  const html = await render(
    EmailTemplate({
      userEmail,
      content,
    }),
  );

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [userEmail],
      subject: "Tulsiveda Website - [Customer Support]",
      html,
    });

    if (error) {
      console.log("@@@@@@@@@@@@ERROR", error);
      return Response.json({ error }, { status: 500 });
    }
    const mailId = data.id;
    console.log(mailId, typeof mailId);
    const response = await db.insert(chats).values({
      id: mailId,
      ticketId: ticketId,
      userEmail: values.userEmail,
      content: content,
      role: role,
    });

    const update = await db
      .update(ticket)
      .set({ status: "pending" })
      .where(eq(ticket.id, ticketId));

    return NextResponse.json({
      message: "Successfully sent",
      data,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error sending mail",
      error,
      success: false,
    });
  }
}
