'use client'
import React, { useState } from 'react';
import HyperText from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }
    const googlekey=process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_KEY
    try {
      const response = await fetch(googlekey || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setMessage("Successfully subscribed!");
        setEmail(''); // Clear the input field
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Error submitting email. Please try again.");
    }
  };

  return (
    <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
      <div>
        <HyperText>Veloentra coming soon!</HyperText>
      </div>
      <div className="text-md">
        <p>Data Simplified. Impact Amplified.</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex w-full items-center justify-between">
          <Input
            type="email"
            placeholder="Email"
            className="w-[75%]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Subscribe</Button>
        </div>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </main>
  );
};

export default Waitlist;
