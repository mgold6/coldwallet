import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-blue-400 transition"
        >
          ColdWallet
        </Link>

        {/* Navigation */}
        <ul className="hidden gap-8 text-gray-300 md:flex">

          <li>
            <Link href="/" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>

          <li>
            <Link href="/learn" className="hover:text-blue-400 transition">
              Learn
            </Link>
          </li>

          <li>
            <a href="/#security" className="hover:text-blue-400 transition">
              Security
            </a>
          </li>

          <li>
            <Link href="/about" className="hover:text-blue-400 transition">
              About ColdWallet
            </Link>
          </li>

          <li>
            <Link href="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </li>

        </ul>

        {/* Buttons */}
        <div className="hidden gap-3 md:flex">

          <Link
            href="/login"
            className="rounded-lg border border-gray-700 px-5 py-2 text-white hover:bg-gray-900 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </nav>
  );
}