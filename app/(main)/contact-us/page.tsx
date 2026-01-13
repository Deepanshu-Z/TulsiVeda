"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { HomeIcon, Mail, Phone } from "lucide-react";

export const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Enter a valid work email"),

  country: z.string().min(1, "Please select your country"),

  subject: z.string().min(5, "Subject must be at least 5 characters"),

  message: z.string().min(10, "Message must be at least 10 characters"),
});

type Schema = z.infer<typeof schema>;

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = (formValues: any) => {
    const response = axios.post("/api/email/contact-support", {
      country: formValues.country,
      userEmail: formValues.email,
      content: formValues.message,
      name: formValues.name,
      subject: formValues.subject,
    });
  };
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          Contact Tulsiveda Support
        </h1>
        <p className="mt-4 text-center">
          We’re here to help you choose the right Ayurvedic solution for your
          health needs.
        </p>

        <Card className="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
          <div>
            <h2 className="text-xl font-semibold">
              Pure Ayurvedic Solutions by Tulsiveda
            </h2>
            <p className="mt-4 text-sm">
              Reach out to us for product guidance, usage support, or any
              questions you may have.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Work Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>Country / Region</Label>
              <Select onValueChange={(v) => setValue("country", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country/Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="other">Outside India</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input {...register("subject")} />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea className="h-32" {...register("message")} />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <Button disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Card>
      </div>
      <div className="flex gap-5">
        <div>
          <Card>
            {" "}
            <Phone /> +91 7982843838
          </Card>
        </div>
        <div>
          <Card>
            <Mail />
            support@tulsiveda.com
          </Card>
        </div>
        <div>
          <Card>
            <HomeIcon />
            West Vinod Nagar, Near Mandawali Metro
          </Card>
        </div>
      </div>
    </section>
  );
}
