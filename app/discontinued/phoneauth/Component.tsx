"use client";

import { auth } from "@/app/discontinued/phoneauth/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState<any>();

  const sendOtp = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
    }
    console.log(phone);
    const result = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      window.recaptchaVerifier
    );

    setConfirmResult(result);
    console.log(result);
  };

  const verifyOtp = async () => {
    try {
      const res = await confirmResult.confirm(otp);
      const token = await res.user.getIdToken();

      // send token to backend
      console.log("Firebase ID Token:", token);
    } catch (error) {
      console.log("Saale glt OTP h");
    }
  };

  return (
    <>
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>

      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Verify OTP</button>

      <div id="recaptcha" />
    </>
  );
}
