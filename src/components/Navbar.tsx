import Link from 'next/link'

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-bold text-[#00B5B4]"
        >
          TrustedWriter
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/settings"
            className="text-gray-600 hover:text-[#00B5B4] transition-colors"
          >
            Settings
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
