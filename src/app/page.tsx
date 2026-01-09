"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="">
      <ThemeToggle />

      <Authenticated>
        <Button>hello</Button>
        <UserButton />
        {tasks?.map(({ _id, text }) => (
          <div key={_id}>{text}</div>
        ))}
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </div>
  );
}
