import * as React from "react";
import { ChatWindow } from "./components/ChatWindow";

export const frontmatter = {
  title: "Agent Chat",
  description: "Chat with the Bedrock agent."
};

export default function Page() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
      <ChatWindow />
    </div>
  );
}
