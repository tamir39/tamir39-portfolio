"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";

export function ContactForm() {
  const id = useId();
  const submitting = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "sent" || status === "error") window.dispatchEvent(new CustomEvent("portfolio:cat", { detail: { signal: status === "sent" ? "form-success" : "form-error" } }));
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    submitting.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fields)),
      });
      if (!response.ok) {
        setError(response.status === 503
          ? "Message delivery isn’t ready yet. You can reach me at tamphi5002@gmail.com."
          : response.status === 429
            ? "Too many attempts. Please try again in a few minutes, or email me directly."
            : "Your message couldn’t be sent. Please try again, or email me directly.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setError("Couldn’t connect. Your message is still here—please try again.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  return <form className="contact-form themed-panel" aria-labelledby={`${id}-heading`} onSubmit={submit} onChange={() => { if (status !== "sending") { setStatus("idle"); setError(""); } }} aria-busy={status === "sending"}>
    <div className="contact-form-heading"><span className="contact-form-marker" aria-hidden="true">↗</span><div><h3 id={`${id}-heading`}>Tell me what you have in mind.</h3><p>A project, a collaboration, or just a hello.</p></div></div>
    <div className="contact-form-fields">
      <div className="contact-field"><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} name="name" autoComplete="name" placeholder="e.g. Alex" required minLength={2} maxLength={80} /></div>
      <div className="contact-field"><label htmlFor={`${id}-email`}>Email address (optional)</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} /></div>
      <div className="contact-field contact-field-message"><label htmlFor={`${id}-message`}>Your message</label><textarea id={`${id}-message`} name="message" placeholder="A little about your idea…" required maxLength={5000} rows={5} /></div>
    </div>
    <div className="contact-form-trap" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field empty</label><input id={`${id}-website`} name="_gotcha" autoComplete="off" tabIndex={-1} /></div>
    <p className="contact-form-error" role="alert">{error}</p>
    <div className="contact-form-bottom"><p>Sent privately to my inbox.<br />Leave an email if you’d like a reply.</p><button type="submit" className="theme-button" disabled={status === "sending"}>{status === "sending" ? <>Sending<LoaderCircle className="contact-sending-icon" size={16} aria-hidden="true" /></> : <>Send message<ArrowUpRight size={17} aria-hidden="true" /></>}</button></div>
    <p className="contact-form-status" role="status" aria-atomic="true">{status === "sent" && <><Check size={16} aria-hidden="true" />Your message is on its way. Thanks for reaching out!</>}</p>
  </form>;
}
