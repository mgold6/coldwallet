import {
  ShieldCheck,
  Wallet,
  Mail,
  CheckCircle,
  MessageCircle,
  Globe,
  Code2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-6">

          {/* Brand */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/20 p-3">
                <Wallet className="h-7 w-7 text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-white">
                ColdWallet
              </h2>

            </div>


            <p className="mt-6 max-w-md leading-7 text-slate-400">
              Securely organize digital assets, monitor portfolios,
              and build confidence through security-focused tools
              and blockchain education.
            </p>


            <div className="mt-6 flex items-center gap-3 text-slate-400">

              <ShieldCheck className="h-5 w-5 text-blue-400" />

              <span>
                Security-focused digital asset management
              </span>

            </div>


            <div className="mt-5 flex items-center gap-2 text-sm text-green-400">

              <CheckCircle className="h-4 w-4" />

              All Systems Operational

            </div>

          </div>



          {/* Product */}
          <div>

            <h3 className="font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-slate-400">

              <li>Dashboard</li>
              <li>Portfolio Tracking</li>
              <li>Wallet Management</li>
              <li>Security Tools</li>

            </ul>

          </div>



          {/* Resources */}
          <div>

            <h3 className="font-semibold text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3 text-slate-400">

              <li>Education Center</li>
              <li>Blockchain Guides</li>
              <li>Market Insights</li>
              <li>Security Practices</li>

            </ul>

          </div>



          {/* Company */}
          <div>

            <h3 className="font-semibold text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3 text-slate-400">

              <li>About ColdWallet</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Security</li>

            </ul>

          </div>



          {/* Community */}
          <div>

            <h3 className="font-semibold text-white">
              Community
            </h3>


            <ul className="mt-5 space-y-4 text-slate-400">

              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                X
              </li>


              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                LinkedIn
              </li>


              <li className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                GitHub
              </li>


              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Discord
              </li>

            </ul>

          </div>

        </div>



        {/* Newsletter */}

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <h3 className="text-xl font-semibold text-white">
                Stay Updated
              </h3>

              <p className="mt-2 text-slate-400">
                Receive digital asset security updates,
                blockchain insights, and ColdWallet news.
              </p>

            </div>


            <div className="flex w-full max-w-md">

              <div className="flex flex-1 items-center gap-3 rounded-l-xl border border-white/10 bg-black/30 px-4">

                <Mail className="h-5 w-5 text-slate-400" />

                <input
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-500"
                />

              </div>


              <button className="rounded-r-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500">
                Subscribe
              </button>

            </div>

          </div>

        </div>



        {/* Supported Assets */}

        <div className="mt-10 border-t border-white/10 pt-8">

          <p className="text-sm text-slate-400">
            Supported Assets
          </p>

          <p className="mt-3 text-slate-300">
            BTC • ETH • SOL • XRP • BNB • AVAX • DOGE • LTC • USDT
          </p>

        </div>



        {/* Bottom */}

        <div className="mt-10 border-t border-white/10 pt-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">


            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} ColdWallet. All rights reserved.
            </p>


            <div className="flex flex-wrap gap-6 text-sm text-slate-400">

              <span>
                Privacy Policy
              </span>

              <span>
                Terms of Service
              </span>

              <span>
                Cookie Policy
              </span>

            </div>


          </div>

        </div>


      </div>
    </footer>
  );
}