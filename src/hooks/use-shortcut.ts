import { useEffect } from "react";

interface ShortcutOptions {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useShortcut(options: ShortcutOptions, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.key.toLowerCase();

      const match =
        pressedKey === options.key.toLowerCase() &&
        (options.ctrl === undefined || e.ctrlKey === options.ctrl) &&
        (options.meta === undefined || e.metaKey === options.meta) &&
        (options.shift === undefined || e.shiftKey === options.shift) &&
        (options.alt === undefined || e.altKey === options.alt);

      if (match) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [options, callback]);
}
