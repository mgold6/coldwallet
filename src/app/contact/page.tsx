"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail, ShieldCheck, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus({
          type: "error",
          message:
            data.message ||
            "Unable to send your message. Please try again.",
        });

        return;
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Your message has been sent successfully.",
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(
        "CONTACT FORM SUBMISSION ERROR:",
        error
      );

      setStatus({
        type: "error",
        message:
          "Unable to send your message right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Contact ColdWallet
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base text-gray-400 sm:text-xl">
            Have a question, need assistance, or want to partner with us?
            Our support team is here to help. Send us a message and we&apos;ll
            respond as quickly as possible.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          {/* Contact Form */}

          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5 sm:p-8">
            <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">
              Send us a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-gray-300"
                >
                  Full Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  maxLength={100}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-gray-300"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="john@example.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-gray-300"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="How can we help?"
                  required
                  maxLength={200}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-gray-300"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Write your message here..."
                  required
                  maxLength={5000}
                  disabled={submitting}
                  className="w-full resize-y rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {status && (
                <div
                  role="alert"
                  className={
                    status.type === "success"
                      ? "rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
                      : "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  }
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>

          {/* Right Side */}

          <div className="space-y-8">
            {/* Support */}

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-8 w-8 shrink-0 text-cyan-400" />

                <div>
                  <h3 className="text-2xl font-semibold">
                    Customer Support
                  </h3>

                  <p className="mt-2 break-all text-gray-400">
                    customerservice@coldwallet.ink
                  </p>

                  <p className="mt-4 leading-7 text-gray-400">
                    Our support team is available to assist with account
                    questions, technical issues, security concerns,
                    partnerships, and general inquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform */}

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <ShieldCheck className="h-8 w-8 shrink-0 text-cyan-400" />

                <h3 className="text-2xl font-semibold">
                  Platform Features
                </h3>
              </div>

              <ul className="space-y-4 text-gray-300">
                <li>✔ Live Cryptocurrency Market Data</li>
                <li>✔ Portfolio Organization</li>
                <li>✔ Wallet Dashboard</li>
                <li>✔ Security Monitoring</li>
                <li>✔ Asset Tracking</li>
                <li>✔ Educational Resources</li>
              </ul>
            </div>

            {/* Learning */}

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-5 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <BookOpen className="h-8 w-8 shrink-0 text-cyan-400" />

                <h3 className="text-2xl font-semibold">
                  Learning Center
                </h3>
              </div>

              <p className="leading-8 text-gray-400">
                Learn about cryptocurrency, blockchain technology, wallet
                security, digital asset management, and investment best
                practices through our growing educational library.
              </p>

              <Link
                href="/learn"
                className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Visit Learning Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
