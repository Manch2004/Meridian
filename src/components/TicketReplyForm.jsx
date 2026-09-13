import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function TicketReplyForm({
  ticketId,
  senderType,
  onSent,
  placeholder,
  errorText,
  sendLabel,
  sendingLabel,
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    setStatus("submitting");
    setError(false);

    const { error: sendError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_type: senderType,
      message: message.trim(),
    });

    if (sendError) {
      setStatus("idle");
      setError(true);
      return;
    }

    setMessage("");
    setStatus("idle");
    onSent();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <textarea
        rows={3}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-main placeholder:text-text-muted/70 transition-colors focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30"
      />
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
          <p>{errorText}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={status === "submitting" || !message.trim()}
        className="inline-flex w-full items-center justify-center rounded-md bg-gold-primary px-8 py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? sendingLabel : sendLabel}
      </button>
    </form>
  );
}
