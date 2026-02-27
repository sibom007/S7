// import { useCallback, useEffect, useRef, useState } from "react";
// import { WebContainer } from "@webcontainer/api";

// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { useFiles } from "@/feature/projects/hooks/use-files";
// import { buildFileTree, getFilePath } from "../utils/file-tree";

// // Singleton WebContainer instance
// let webcontainerInstance: WebContainer | null = null;
// let bootPromise: Promise<WebContainer> | null = null;

// const getWebContainer = async (): Promise<WebContainer> => {
//   if (webcontainerInstance) {
//     return webcontainerInstance;
//   }

//   if (!bootPromise) {
//     bootPromise = WebContainer.boot({ coep: "credentialless" });
//   }

//   webcontainerInstance = await bootPromise;
//   return webcontainerInstance;
// };

// const teardownWebContainer = () => {
//   if (webcontainerInstance) {
//     webcontainerInstance.teardown();
//     webcontainerInstance = null;
//   }
//   bootPromise = null;
// };

// interface UseWebContainerProps {
//   projectId: Id<"projects">;
//   enabled: boolean;
//   settings?: {
//     installCommand?: string;
//     devCommand?: string;
//   };
// }

// export const useWebContainer = ({
//   projectId,
//   enabled,
//   settings,
// }: UseWebContainerProps) => {
//   const [status, setStatus] = useState<
//     "idle" | "booting" | "installing" | "running" | "error"
//   >("idle");
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [restartKey, setRestartKey] = useState(0);
//   const [terminalOutput, setTerminalOutput] = useState("");

//   const containerRef = useRef<WebContainer | null>(null);
//   const hasStartedRef = useRef(false);

//   // Fetch files from Convex (auto-updates on changes)
//   const files = useFiles(projectId);

//   // Initial boot and mount
//   useEffect(() => {
//     const hasPackageJson = files?.some(
//       (f) => f.type === "file" && f.name === "package.json",
//     );

//     if (
//       !enabled ||
//       !files ||
//       files.length === 0 ||
//       !hasPackageJson ||
//       hasStartedRef.current
//     ) {
//       return;
//     }
//     if (!enabled || !files || files.length === 0 || hasStartedRef.current) {
//       return;
//     }

//     hasStartedRef.current = true;

//     const start = async () => {
//       try {
//         setStatus("booting");
//         setError(null);
//         setTerminalOutput("");

//         const appendOutput = (data: string) => {
//           setTerminalOutput((prev) => prev + data);
//         };

//         const container = await getWebContainer();
//         containerRef.current = container;

//         const fileTree = buildFileTree(files);
//         await container.mount(fileTree);

//         container.on("server-ready", (_port, url) => {
//           setPreviewUrl(url);
//           setStatus("running");
//         });

//         setStatus("installing");

//         // Parse install command (default: npm install)
//         const installCmd = settings?.installCommand || "npm install";
//         const [installBin, ...installArgs] = installCmd.split(" ");
//         appendOutput(`$ ${installCmd}\n`);
//         const installProcess = await container.spawn(installBin, installArgs);
//         installProcess.output.pipeTo(
//           new WritableStream({
//             write(data) {
//               appendOutput(data);
//             },
//           }),
//         );
//         const installExitCode = await installProcess.exit;

//         if (installExitCode !== 0) {
//           throw new Error(`${installCmd} failed with code ${installExitCode}`);
//         }

//         // Parse dev command (default: npm run dev)
//         const devCmd = settings?.devCommand || "npm run dev";
//         const [devBin, ...devArgs] = devCmd.split(" ");
//         appendOutput(`\n$ ${devCmd}\n`);
//         const devProcess = await container.spawn(devBin, devArgs);
//         devProcess.output.pipeTo(
//           new WritableStream({
//             write(data) {
//               appendOutput(data);
//             },
//           }),
//         );
//       } catch (error) {
//         setError(error instanceof Error ? error.message : "Unknown error");
//         setStatus("error");
//       }
//     };

//     start();
//   }, [
//     enabled,
//     files,
//     restartKey,
//     settings?.devCommand,
//     settings?.installCommand,
//   ]);

//   // Sync file changes (hot-reload)
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container || !files || status !== "running") return;

//     const filesMap = new Map(files.map((f) => [f._id, f]));

//     for (const file of files) {
//       if (file.type !== "file" || file.storageId || !file.content) continue;

//       const filePath = getFilePath(file, filesMap);
//       container.fs.writeFile(filePath, file.content);
//     }
//   }, [files, status]);

//   // Reset when disabled
//   useEffect(() => {
//     if (!enabled) {
//       hasStartedRef.current = false;
//       setStatus("idle");
//       setPreviewUrl(null);
//       setError(null);
//     }
//   }, [enabled]);

//   // Restart the entire WebContainer process
//   const restart = useCallback(() => {
//     teardownWebContainer();
//     containerRef.current = null;
//     hasStartedRef.current = false;
//     setStatus("idle");
//     setPreviewUrl(null);
//     setError(null);
//     setRestartKey((k) => k + 1);
//   }, []);

//   return {
//     status,
//     previewUrl,
//     error,
//     restart,
//     terminalOutput,
//   };
// };

import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useFiles } from "@/feature/projects/hooks/use-files";
import { buildFileTree, getFilePath } from "../utils/file-tree";

let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
  try {
    if (webcontainerInstance) return webcontainerInstance;

    if (!bootPromise) {
      bootPromise = WebContainer.boot({ coep: "credentialless" });
    }

    webcontainerInstance = await bootPromise;
    return webcontainerInstance;
  } catch {
    bootPromise = null;
    throw new Error("Failed to boot WebContainer");
  }
};

const teardownWebContainer = () => {
  try {
    webcontainerInstance?.teardown();
  } catch {}
  webcontainerInstance = null;
  bootPromise = null;
};

interface UseWebContainerProps {
  projectId: Id<"projects">;
  enabled: boolean;
  settings?: {
    installCommand?: string;
    devCommand?: string;
  };
}

type RunnerError =
  | "NO_FILES"
  | "NO_PACKAGE_JSON"
  | "BOOT_FAILED"
  | "MOUNT_FAILED"
  | "INSTALL_FAILED"
  | "DEV_FAILED"
  | "TIMEOUT"
  | "UNKNOWN";

export const useWebContainer = ({
  projectId,
  enabled,
  settings,
}: UseWebContainerProps) => {
  const [status, setStatus] = useState<
    "idle" | "booting" | "installing" | "running" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<RunnerError | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [restartKey, setRestartKey] = useState(0);

  const containerRef = useRef<WebContainer | null>(null);
  const hasStartedRef = useRef(false);

  const files = useFiles(projectId);

  const appendOutput = (data: string) => {
    setTerminalOutput((prev) => prev + data);
  };

  const withTimeout = async <T>(
    promise: Promise<T>,
    ms: number,
    label: string,
  ): Promise<T> => {
    let timeoutId;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${label} timed out after ${ms}ms`));
      }, ms);
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const detectProjectRoot = (files: Doc<"files">[]) => {
    const packageFiles = files.filter(
      (f) => f.type === "file" && f.name === "package.json",
    );

    if (packageFiles.length === 0) return null;

    const filesMap = new Map(files.map((f) => [f._id, f]));

    const sorted = packageFiles
      .map((pf) => ({
        file: pf,
        path: getFilePath(pf, filesMap),
      }))
      .sort((a, b) => a.path.split("/").length - b.path.split("/").length);

    const best = sorted[0];
    const dir = best.path.includes("/")
      ? best.path.substring(0, best.path.lastIndexOf("/"))
      : "";

    return { dir, path: best.path };
  };

  const detectPackageManager = (files: Doc<"files">[]) => {
    if (files.some((f) => f.name === "pnpm-lock.yaml")) return "pnpm";
    if (files.some((f) => f.name === "yarn.lock")) return "yarn";
    return "npm";
  };

  useEffect(() => {
    if (!enabled) return;
    if (!files || files.length === 0) {
      setStatus("error");
      setErrorType("NO_FILES"); 
      setErrorMessage("No project files found");
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const start = async () => {
      try {
        setStatus("booting");
        setErrorType(null);
        setErrorMessage(null);
        setTerminalOutput("");

        const root = detectProjectRoot(files);
        if (!root) {
          setStatus("error");
          setErrorType("NO_PACKAGE_JSON"); 
          setErrorMessage("package.json not found in project");
          return;
        }

        appendOutput(`Project root detected: ${root.dir || "/"}\n`);

  
        const container = await withTimeout(
          getWebContainer(),
          20000,
          "WebContainer boot",
        );

        containerRef.current = container;

        try {
          const fileTree = buildFileTree(files);
          await withTimeout(container.mount(fileTree), 20000, "Mount");
        } catch {
          setStatus("error");
          setErrorType("MOUNT_FAILED");
          setErrorMessage("Failed to mount project files");
          return;
        }

        const pkgManager = detectPackageManager(files);
        appendOutput(`Using package manager: ${pkgManager}\n`);

        container.on("server-ready", (_port, url) => {
          appendOutput(`Server started: ${url}\n`);
          setPreviewUrl(url);
          setStatus("running");
        });

        setStatus("installing");

        const installCmd =
          settings?.installCommand ||
          (pkgManager === "pnpm"
            ? "pnpm install"
            : pkgManager === "yarn"
              ? "yarn install"
              : "npm install");

        const fullInstall = root.dir
          ? `cd ${root.dir} && ${installCmd}`
          : installCmd;

        appendOutput(`\n$ ${fullInstall}\n`);

        try {
          const installProcess = await container.spawn("sh", [
            "-c",
            fullInstall,
          ]);

          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                appendOutput(data);
              },
            }),
          );

          const exitCode = await withTimeout(
            installProcess.exit,
            120000,
            "Install",
          );

          if (exitCode !== 0) {
            setStatus("error");
            setErrorType("INSTALL_FAILED");
            setErrorMessage(`Dependency install failed (code ${exitCode})`);
            return;
          }
        } catch  {
          setStatus("error");
          setErrorType("INSTALL_FAILED");
          setErrorMessage("Install process crashed");
          return;
        }

        const devCmd =
          settings?.devCommand ||
          (pkgManager === "pnpm"
            ? "pnpm dev"
            : pkgManager === "yarn"
              ? "yarn dev"
              : "npm run dev");

        const fullDev = root.dir ? `cd ${root.dir} && ${devCmd}` : devCmd;

        appendOutput(`\n$ ${fullDev}\n`);

        try {
          const devProcess = await container.spawn("sh", ["-c", fullDev]);

          devProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                appendOutput(data);
              },
            }),
          );
        } catch {
          setStatus("error");
          setErrorType("DEV_FAILED"); 
          setErrorMessage("Dev server failed to start");
        }
      } catch (err) {
        setStatus("error");
        setErrorType("UNKNOWN"); 
        setErrorMessage(
          err instanceof Error ? 
          err?.message : "Unexpected error occurred"
        );
      }
    };

    start();
  }, [
    enabled,
    files,
    restartKey,
    settings?.installCommand,
    settings?.devCommand,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !files || status === "booting") return;

    const filesMap = new Map(files.map((f) => [f._id, f]));

    for (const file of files) {
      try {
        if (file.type !== "file" || file.content == null) continue;
        const path = getFilePath(file, filesMap);
        container.fs.writeFile(path, file.content);
      } catch {
        // silently ignore bad AI file writes
      }
    }
  }, [files, status]);

  const restart = useCallback(() => {
    teardownWebContainer();
    containerRef.current = null;
    hasStartedRef.current = false;
    setStatus("idle");
    setPreviewUrl(null);
    setErrorType(null);
    setErrorMessage(null);
    setRestartKey((k) => k + 1);
  }, []);

  return {
    status,
    previewUrl,
    errorType, 
    errorMessage, 
    restart,
    terminalOutput,
  };
};
