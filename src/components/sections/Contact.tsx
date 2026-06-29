"use client";
import { useState, useRef } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Download, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MagneticButton } from "@/components/fx/Magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/fx/BrandIcons";
import { profile } from "@/lib/data/profile";
import { toast } from "sonner";

const WEB3FORMS_ACCESS_KEY = "6c3e0b27-d0cb-4716-b094-b116e74a8f88";

const schema = z.object({
  name: z.string().trim().min(1, "Your name, please.").max(80),
  email: z.string().trim().email("That email looks off.").max(160),
  message: z
    .string()
    .trim()
    .min(8, "A few more words would help.")
    .max(2000, "Try to keep it under 2000 characters."),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_g4e2lhp",
          template_id: "template_cylz5fi",
          user_id: "YK_Okufd_p9d8vqsD",
          template_params: {
            name: parsed.data.name,
            email: parsed.data.email,
            message: parsed.data.message,
            title: `Portfolio inquiry — ${parsed.data.name}`,
          },
        }),
      });

      if (response.ok) {
        setSent(true);
        formRef.current?.reset();
        toast.success("Message sent!", {
          description: "Thanks for reaching out — I'll get back to you soon.",
        });
      } else {
        toast.error("Failed to send message", {
          description: "Something went wrong. Please try again or email me directly.",
        });
      }
    } catch {
      toast.error("Network error", {
        description: "Couldn't reach the server. Please check your connection and try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let's build something <span className="text-gradient-cool">worth shipping</span>.</>}
          description="For roles, collaborations, or just to swap notes on AI tooling — the inbox is open."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="space-y-4">
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone.replace(/\s|-/g, "")}`}
              />
              <ContactRow
                icon={<MapPin className="h-4 w-4" />}
                label="Based in"
                value={profile.location}
              />
              <ContactRow
                icon={<GithubIcon className="h-4 w-4" />}
                label="GitHub"
                value={`@${profile.githubUser}`}
                href={profile.github}
              />
              <ContactRow
                icon={<LinkedinIcon className="h-4 w-4" />}
                label="LinkedIn"
                value="aaliyan-arif"
                href={profile.linkedin}
              />

              <a
                href={profile.resumeUrl}
                download="Aaliyan_Arif_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="glass mt-6 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <Download className="h-4 w-4 text-cyan" />
                Download résumé
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="glass-strong relative overflow-hidden rounded-3xl p-8"
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan/15 blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative grid gap-5">
                <Field
                  label="Name"
                  name="name"
                  placeholder="What should I call you?"
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="Message"
                  name="message"
                  as="textarea"
                  placeholder="What are you building?"
                  error={errors.message}
                  rows={5}
                />

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Your message will be delivered directly to my inbox.
                  </p>
                  <MagneticButton type="submit" disabled={sending}>
                    {sent ? (
                      <>
                        Sent <Check className="h-4 w-4" />
                      </>
                    ) : sending ? (
                      <>
                        Sending <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </MagneticButton>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="glass flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/[0.06]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-cyan">
          {icon}
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="text-sm">{value}</p>
        </div>
      </div>
      {href && <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {Inner}
    </a>
  ) : (
    Inner
  );
}

function Field({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  error,
  autoComplete,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  rows?: number;
}) {
  const baseClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-cyan/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-cyan/30";
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {error && (
          <span className="normal-case tracking-normal text-destructive">{error}</span>
        )}
      </span>
      {as === "input" ? (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={baseClass}
        />
      ) : (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClass} resize-y`}
        />
      )}
    </label>
  );
}
