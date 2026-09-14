import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Bot, Loader2, LifeBuoy } from "lucide-react";
import { AI_CHAT_API_URL } from "../config/links";
import { useAIChat } from "../context/AIChatContext";

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-md border px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "border-gold-primary/25 bg-gold-primary/10 text-text-main"
            : "border-border-default bg-bg-secondary text-text-main"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function AIChatWidget() {
  const { t } = useTranslation();
  const { open, setOpen } = useAIChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(false);

    const assistantId = crypto.randomUUID();
    let assistantStarted = false;
    let streamFailed = false;

    try {
      const response = await fetch(`${AI_CHAT_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok || !response.body) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const rawEvent = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          let eventType = "message";
          let dataLine = "";
          for (const line of rawEvent.split("\n")) {
            if (line.startsWith("event:")) eventType = line.slice(6).trim();
            else if (line.startsWith("data:")) dataLine = line.slice(5).trim();
          }

          if (dataLine) {
            const payload = JSON.parse(dataLine);

            if (eventType === "delta" && typeof payload.text === "string") {
              if (!assistantStarted) {
                assistantStarted = true;
                setLoading(false);
                setMessages((current) => [
                  ...current,
                  { id: assistantId, role: "assistant", content: payload.text },
                ]);
              } else {
                setMessages((current) =>
                  current.map((message) =>
                    message.id === assistantId
                      ? { ...message, content: message.content + payload.text }
                      : message,
                  ),
                );
              }
            } else if (eventType === "error") {
              streamFailed = true;
            }
          }

          boundary = buffer.indexOf("\n\n");
        }
      }

      if (streamFailed && !assistantStarted) throw new Error("Stream failed");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? t("aiChat.close") : t("aiChat.open")}
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-primary text-bg-primary shadow-lg transition-colors hover:bg-gold-light"
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={2} />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={2} />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-md border border-border-default bg-bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border-default bg-bg-secondary px-4 py-3">
            <Bot className="h-4 w-4 text-gold-primary" strokeWidth={2} />
            <p className="text-sm font-semibold text-text-main">{t("aiChat.title")}</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <MessageBubble role="assistant" content={t("aiChat.greeting")} />

            {messages.map((message) => (
              <MessageBubble key={message.id} role={message.role} content={message.content} />
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="inline-flex items-center gap-2 rounded-md border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-dim">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  {t("aiChat.thinking")}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start">
                <div className="max-w-[85%] rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {t("aiChat.error")}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-border-default px-3 py-3">
            <textarea
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("aiChat.placeholder")}
              className="max-h-24 flex-1 resize-none rounded-md border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 transition-colors focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label={t("aiChat.send")}
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gold-primary text-bg-primary transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <Link
            to="/my-tickets/new"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-border-default bg-bg-secondary px-4 py-2.5 text-xs font-medium text-gold-primary transition-colors hover:text-gold-light"
          >
            <LifeBuoy className="h-3.5 w-3.5" strokeWidth={2} />
            {t("aiChat.contactSupport")}
          </Link>
        </div>
      )}
    </>
  );
}
