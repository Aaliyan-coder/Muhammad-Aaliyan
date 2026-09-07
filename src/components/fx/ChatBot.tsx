"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { Bitmoji } from "@/components/fx/Bitmoji";
import { ask, OPENING, type Answer } from "@/lib/chat/knowledge";
import { profile } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  chips?: string[];
};

/**
 * Floating "ask me anything" chat.
 *
 * Answers come from `lib/chat/knowledge`, which composes replies out of the
 * same data the site renders — no API call, no key, nothing to rate-limit, and
 * it cannot invent a job or a skill. The reply delay is cosmetic (it reads as
 * thinking); the answer itself is already resolved.
 */
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: OPENING.text, chips: OPENING.chips },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  // Ids are minted outside the state updater. React invokes updaters twice
  // in StrictMode, so incrementing a counter inside one is impure and
  // yields duplicate, unstable React keys.
  const idRef = useRef(1);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 260);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = (raw: string) => {
    const question = raw.trim();
    if (!question || typing) return;

    setDraft("");
    const userId = idRef.current++;
    setMessages((m) => [...m, { id: userId, from: "user", text: question }]);
    setTyping(true);

    const reply: Answer = ask(question);
    // Length-aware pause so short answers don't feel laggy and long ones don't
    // slam in instantly. Capped so it never feels broken.
    const delay = Math.min(900, 320 + reply.text.length * 1.6);

    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        const botId = idRef.current++;
        setMessages((m) => [
          ...m,
          { id: botId, from: "bot", text: reply.text, chips: reply.chips },
        ]);
      }, delay),
    );
  };

  const last = messages[messages.length - 1];
  const chips = !typing && last?.from === "bot" ? last.chips : undefined;

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : `Chat with ${profile.name}`}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.92 }}
        className="glass fixed bottom-5 right-5 z-[120] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] transition-colors hover:border-white/25"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,oklch(0.24_0.05_270),oklch(0.10_0.02_260))]"
            />
            <Bitmoji
              variant="bust"
              float={false}
              src={profile.avatar || undefined}
              className="relative h-[128%] w-auto"
            />
            <span
              aria-hidden
              className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-background bg-cyan shadow-[0_0_10px_var(--cyan)]"
            />
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Chat with ${profile.name}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="glass-strong fixed bottom-24 right-5 z-[120] flex h-[min(30rem,calc(100vh-9rem))] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_35%,oklch(0.24_0.05_270),oklch(0.10_0.02_260))]">
                <Bitmoji
                  variant="bust"
                  float={false}
                  src={profile.avatar || undefined}
                  className="h-[128%] w-auto"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Answers from my real CV
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      m.from === "user"
                        ? "rounded-br-md bg-foreground text-background"
                        : "rounded-bl-md border border-white/10 bg-white/[0.04] text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => send(c)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-cyan/40 hover:bg-cyan/[0.08] hover:text-foreground"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about my work…"
                aria-label="Ask a question"
                className="min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
