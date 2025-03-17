"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Timer } from "lucide-react";

const Page = () => {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(60); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); 
          setVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold text-light-100">
        Whoa, Slow Down There, Speedy!
      </h1>
      <p className="mt-3 max-w-xl text-center text-light-400">
        Looks like you&apos;ve been a little too eager. We&apos;ve put a
        temporary pause on your excitement. 🚦 Chill for a bit, and try again
        shortly.
      </p>
      <Button className="mt-4" asChild>
        {visible ? <Link href="/">Go Back</Link> : <Loading countdown={countdown} />}
      </Button>
    </main>
  );
};

const Loading = ({ countdown }: { countdown: number }) => {
  return (
    <div className="flex items-center justify-center">
      <Timer className="size-10 text-primary m-4" />
      <span className="text-light-400 text-xl">{countdown}s</span>
    </div>
  );
};

export default Page;
