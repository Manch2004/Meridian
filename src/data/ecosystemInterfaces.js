import { LayoutDashboard, Globe, Send, Bot } from "lucide-react";

const ecosystemInterfaces = [
  { key: "app", Icon: LayoutDashboard },
  { key: "website", Icon: Globe, isCurrent: true },
  { key: "telegram", Icon: Send, external: true },
  { key: "bot", Icon: Bot },
];

export default ecosystemInterfaces;
