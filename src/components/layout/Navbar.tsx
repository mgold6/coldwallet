export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div className="text-2xl font-bold text-white">
          ColdWallet
        </div>

        <ul className="hidden gap-8 text-gray-300 md:flex">
          <li className="cursor-pointer hover:text-blue-400">Home</li>
          <li className="cursor-pointer hover:text-blue-400">Learn</li>
          <li className="cursor-pointer hover:text-blue-400">Security</li>
          <li className="cursor-pointer hover:text-blue-400">Resources</li>
          <li className="cursor-pointer hover:text-blue-400">Pricing</li>
          <li className="cursor-pointer hover:text-blue-400">Contact</li>
        </ul>

        <div className="hidden gap-3 md:flex">
          <button className="rounded-lg border border-gray-700 px-5 py-2 hover:bg-gray-900">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}