"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";

const page = () => {
  const getEmails = async () => {
    const response = await axios.post("/api/events");
    console.log("Mails:: ", response);
  };
  return (
    <div>
      <button onClick={getEmails}>Get Emails</button>
    </div>
  );
};

export default page;
