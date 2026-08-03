import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { Mail, ShieldCheck, BookOpen } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Contact ColdWallet</h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-400">
            Have a question, need assistance, or want to partner with us?
            Our support team is here to help. Send us a message and we'll
            respond as quickly as possible.
          </p>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">

          {/* Contact Form */}

          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">

            <h2 className="mb-8 text-3xl font-semibold">
              Send us a Message
            </h2>

            <form className="space-y-6">

              <div>
                <label className="mb-2 block text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
              </button>

            </form>

          </div>

          {/* Right Side */}

          <div className="space-y-8">

            {/* Support */}

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">

              <div className="flex items-center gap-4">

                <Mail className="h-8 w-8 text-cyan-400" />

                <div>
                  <h3 className="text-2xl font-semibold">
                    Customer Support
                  </h3>

                  <p className="mt-2 text-gray-400">
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

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">

              <div className="flex items-center gap-4 mb-6">

                <ShieldCheck className="h-8 w-8 text-cyan-400" />

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

            <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8">

              <div className="flex items-center gap-4 mb-6">

                <BookOpen className="h-8 w-8 text-cyan-400" />

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

      <Footer />

    </main>
  );
}