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
      <span>{content}</span>
    </div>
  );
}
