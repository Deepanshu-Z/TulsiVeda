import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/mail/email-template";
import { NextResponse } from "next/server";
import db from "@/db/db";
import { chats } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const values = await req.json();

  const userEmail = values.userEmail;
  // const subject = values.subject;
  const content = values.content;
  const ticketId = values.ticketId;

  if (!userEmail) return Response.json("Unauthenticated", { status: 400 });

  const html = await render(
    EmailTemplate({
      userEmail,
      content,
    })
  );

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [userEmail],
      subject: "Nutrivya Website - [Customer Support]",
      html,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    const mailId = data.id;
    console.log(mailId, typeof mailId);
    const response = await db.insert(chats).values({
      id: mailId,
      ticketId: ticketId,
      userEmail: userEmail,
      content: content,
    });

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
