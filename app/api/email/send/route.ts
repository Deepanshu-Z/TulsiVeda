import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/components/mail/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { username } = await req.json();
  console.log(username);
  const html = await render(EmailTemplate({ firstName: `${username}` }));
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: ["deepanshupokhriyal07@gmail.com"],
      subject: "Hello world",
      html,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
