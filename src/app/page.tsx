"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AuthLoading, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { AuthLoadingView } from "@/feature/auth/components/auth-loading-view";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const create = useMutation(api.projects.create);

  console.log(projects);
  const handleProject = () => {
    create({
      name: "new projects",
    });
  };

  return (
    <div className="">
      <ThemeToggle />

      <Authenticated>
        <Button onClick={handleProject}>create</Button>
        <UserButton />
        {projects?.map((project) => (
          <div key={project._id}>
            {project.name} {project.ownerId}
          </div>
        ))}
      </Authenticated>
      <AuthLoading>
        <AuthLoadingView />
      </AuthLoading>
    </div>
  );
}
