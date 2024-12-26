"use client";
import React, { useState } from "react";
import HyperText from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_KEY;

    if (!googleKey) {
      console.error("Google Spreadsheet Key is missing. Please check your environment variables.");
      setMessage("Server configuration error. Please try again later.");
      setStatus("error");
      return;
    }

    console.log(JSON.stringify({ email }));
    try {
      const response = await fetch(googleKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `email=${encodeURIComponent(email)}`,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Response:", result);

      if (result.result === "success") {
        setMessage("Successfully subscribed!");
        setStatus("success");
        console.log(status);
        setEmail("");
      } else {
        setMessage(result.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage("Error submitting email. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start ">
      <div>
        <HyperText>Veloentra coming soon!</HyperText>
      </div>
      <div className="text-md">
        <p>Data Simplified. Impact Amplified.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <Input
            type="email"
            placeholder="Email"
            className="w-[75%]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <Button
            className="w-[160px]"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
      </form>
      {message && (
        <p className={`text-sm ${status === "success" ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </main>
  );
};

export default Waitlist;
