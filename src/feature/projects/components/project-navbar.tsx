// import { projectId } from "@/types";
// import { BellIcon, ChevronRightIcon, CloudCheckIcon } from "lucide-react";
// import Image from "next/image";
// import { useProject } from "../hooks/use-projects";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { formatDistanceToNow } from "date-fns";
// import { UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// export const Navbar = ({ projectId }: { projectId: projectId }) => {
//   const project = useProject(projectId);

//   const HandleRemane = () => {
//     console.log("hello");
//   };

//   return (
//     <nav className="flex  items-center justify-between gap-x-2 p-4 border-b">
//       <div className="flex justify-between items-center w-full mr-5">
//         <div className="flex items-center gap-2">
//           <Image src={"/logo.svg"} alt="logo" width={50} height={50} />
//           <h1 className="text-2xl text-muted-foreground">S7</h1>
//           <ChevronRightIcon className="size-5 text-muted-foreground" />
//           {project === undefined ? (
//             <Spinner />
//           ) : (
//             <span className="text-xl" onDoubleClick={HandleRemane}>
//               {project?.name}
//             </span>
//           )}

//           <Tooltip>
//             <TooltipTrigger>
//               <CloudCheckIcon className="size-4 text-muted-foreground" />
//             </TooltipTrigger>
//             <TooltipContent>
//               {formatDistanceToNow(project?.updateAt ?? 0, {
//                 addSuffix: true,
//               })}
//             </TooltipContent>
//           </Tooltip>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant={"outline"}>
//             <BellIcon />
//           </Button>
//           <UserButton
//             appearance={{
//               elements: {
//                 userButtonAvatarBox: "size-10",
//               },
//             }}
//           />
//         </div>
//       </div>
//     </nav>
//   );
// };

import { useEffect, useRef, useState } from "react";
import { projectId } from "@/types";
import {
  BellIcon,
  ChevronRightIcon,
  CloudCheckIcon,
  Loader2Icon,
} from "lucide-react";
import Image from "next/image";
import { useProject, useRename } from "../hooks/use-projects";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Navbar = ({ projectId }: { projectId: projectId }) => {
  const project = useProject(projectId);
  const rename = useRename();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleRenameStart = () => {
    console.log("helo");
    if (!project) return;
    setName(project.name); // prefill with previous name
    setIsEditing(true);
  };

  const handleRenameCancel = () => {
    setIsEditing(false);
    setName("");
  };

  const handleRenameSave = async () => {
    if (!project) return;

    const trimmed = name.trim();
    if (!trimmed) return handleRenameCancel();

    rename({
      projectId,
      name,
    });

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <nav className="flex items-center justify-between gap-x-2 p-4 border-b">
      <div className="flex justify-between items-center w-full mr-5">
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} />
          <h1 className="text-2xl text-muted-foreground">S7</h1>

          <ChevronRightIcon className="size-5 text-muted-foreground" />

          {project === undefined ? (
            <Spinner />
          ) : isEditing ? (
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRenameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSave();
                if (e.key === "Escape") handleRenameCancel();
              }}
              className="h-9 w-44 rounded-md border bg-background px-2 text-xl outline-none focus:ring-2 focus:ring-ring duration-700"
            />
          ) : (
            <span className="text-xl" onDoubleClick={handleRenameStart}>
              {project?.name}
            </span>
          )}

          {project?.importStatus === "importing" ? (
            <Tooltip>
              <TooltipTrigger>
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Importing...</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <CloudCheckIcon className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                {formatDistanceToNow(project?.updateAt ?? 0, {
                  addSuffix: true,
                })}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant={"outline"}>
            <BellIcon />
          </Button>

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "size-10",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};
