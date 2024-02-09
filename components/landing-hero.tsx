"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="space-y-5 font-bold text-center text-white py-36">
      <div className="space-y-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
        <h1>The Best AI Tool for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-600">
          <TypewriterComponent
            options={{
              strings: ["Social Posts."],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm font-light text-white md:text-xl">
        Create content using AI 10x faster.
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            variant="premium"
            className="p-4 font-semibold rounded-full md:text-lg md:p-6"
          >
            Start Generating For Free
          </Button>
        </Link>
      </div>
      <div className="text-xs font-normal text-white md:text-sm">
        No credit card required.
      </div>
    </div>
  );
};
