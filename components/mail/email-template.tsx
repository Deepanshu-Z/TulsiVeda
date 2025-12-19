import * as React from "react";

interface EmailTemplateProps {
  userEmail: string;
  userId: string;
  subject: string;
  content: string;
}

export default function EmailTemplate({
  userEmail,
  userId,
  subject,
  content,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {userEmail}!</h1>
      <p>Your details are as follows :-</p>
      <p>
        User ID: <span>{userId}</span>
      </p>
      <p>
        Subject: <span>{subject}</span>
      </p>
      <p>
        Content: <span>{content}</span>
      </p>
    </div>
  );
}
