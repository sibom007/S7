import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { projectId } from "@/types";
import { useClerk } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import ky, { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  url: z.url("Please enter valid URL"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportGithubDialog = ({ onOpenChange, open }: Props) => {
  const router = useRouter();
  const { openUserProfile } = useClerk();

  const form = useForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { projectId } = await ky
          .post("/api/github/import", {
            json: { url: value.url },
          })
          .json<{
            success: boolean;
            projectId: projectId;
            eventId: string;
          }>();
        toast.success("Importing repository...");
        onOpenChange(false);

        router.push(`/projects/${projectId}`);
      } catch (error) {
        if (error instanceof HTTPError) {
          let body: { error?: string; code?: string } | null = null;

          try {
            body = await error.response.json();
          } catch {}

          // TEMP fallback until backend sends `code`
          const errorMessage = body?.error ?? "";

          if (error.response.status === 403) {
            if (
              body?.code === "PRO_REQUIRED" ||
              errorMessage.includes("Pro plan required")
            ) {
              toast.error("Upgrade to import repositories", {
                action: {
                  label: "Upgrade",
                  onClick: () => openUserProfile(),
                },
              });
              onOpenChange(false);
              return;
            }

            if (
              body?.code === "GITHUB_NOT_CONNECTED" ||
              errorMessage.includes("GitHub")
            ) {
              toast.error("GitHub account not connected", {
                action: {
                  label: "Connect",
                  onClick: () => openUserProfile(),
                },
              });
              onOpenChange(false);
              return;
            }
          }

          if (body?.error) {
            toast.error(body.error);
            return;
          }

          toast.error(`Request failed (${error.response.status})`);
          return;
        }

        console.error(error);
        toast.error(
          "Unable to import repository. Please check the URL and try again",
        );
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>
            Enter a GitHub repository URL to import. A new Project will be
            created with the repository contents.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
          <form.Field name="url">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Repository URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="https://github.com/owner/repo"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Importing..." : "Import"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
