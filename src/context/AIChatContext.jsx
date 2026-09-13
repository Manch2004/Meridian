import { createContext, useContext, useState } from "react";

const AIChatContext = createContext(null);

export function AIChatProvider({ children }) {
  const [open, setOpen] = useState(false);

  return <AIChatContext.Provider value={{ open, setOpen }}>{children}</AIChatContext.Provider>;
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) throw new Error("useAIChat must be used within an AIChatProvider");
  return context;
}
