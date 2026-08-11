"use client";

import { FormEvent, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ContactFormProps = {
  dictionary: Dictionary["contact"];
};

export function ContactForm({ dictionary }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-xl border border-brand-soft/50 bg-brand-soft/20 px-4 py-3 text-sm text-foreground">
        {dictionary.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">{dictionary.name}</span>
        <input
          name="name"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">{dictionary.email}</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">{dictionary.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      <button
        type="submit"
          className="mt-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-green-dark hover:brightness-105"
      >
        {dictionary.submit}
      </button>
    </form>
  );
}
