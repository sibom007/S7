import { EditorView } from "@codemirror/view";

export const customTheme = EditorView.theme({
  "&": {
    outline: "none !important",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  ".cm-content": {
    fontFamily: "var(--font-plex-mono), monospace",
    fontSize: "14px",
  },
  ".cm-scroller": {
    scrollbarWidth: "thin",
    scrollbarColor: "#3f3f46 transparent",

    minHeight: 0,
  },
  ".cm-editor": {
    height: "100%",
    minHeight: 0,
  },
  
});
