import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from "react";

const help = {
  name: "help",
  keyCommand: "help",
  buttonProps: { "aria-label": "Insert help" },
  icon: (
    <svg viewBox="0 0 16 16" width="12px" height="12px">
      <path
        d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    window.open("https://www.markdownguide.org/basic-syntax/", "_blank");
  },
};
// Pour récupérer la valeur du markdown: <MDEditor.Markdown source={value} />
export default function Markdown() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <MDEditor
      value={value}
      // preview="split"
      commands={[...commands.getCommands(), help]}
      onChange={(val) => setValue(val)}
    />
  );
}
