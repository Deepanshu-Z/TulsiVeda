import * as React from "react";

interface EmailTemplateProps {
  userEmail: string;
  // userId: string;
  // subject: string;
  content: string;
}

export default function EmailTemplate({
  userEmail,
  content,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {userEmail}!</h1>
      <p>Your details are as follows :-</p>
      <p>
        Content: <span>{content}</span>
      </p>
    </div>
  );
}
