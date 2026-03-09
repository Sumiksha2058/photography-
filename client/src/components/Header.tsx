import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Soul Lens Photography" className="h-10 w-10 rounded-full" />
              <span className="font-bold text-lg hidden sm:inline">Soul Lens</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`${isActive("/") ? "text-red-500 font-semibold" : "text-gray-700"} hover:text-red-500 transition`}>
                Home
              </a>
            </Link>
            <Link href="/gallery">
              <a className={`${isActive("/gallery") ? "text-red-500 font-semibold" : "text-gray-700"} hover:text-red-500 transition`}>
                Gallery
              </a>
            </Link>
            <Link href="/about">
              <a className={`${isActive("/about") ? "text-red-500 font-semibold" : "text-gray-700"} hover:text-red-500 transition`}>
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className={`${isActive("/contact") ? "text-red-500 font-semibold" : "text-gray-700"} hover:text-red-500 transition`}>
                Contact
              </a>
            </Link>

            {/* Admin Link */}
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className={`${isActive("/admin") ? "text-red-500 font-semibold" : "text-gray-700"} hover:text-red-500 transition`}>
                  Admin
                </a>
              </Link>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">{user?.name}</span>
                  <Button onClick={logout} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => window.location.href = getLoginUrl()} variant="default" size="sm">
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/">
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Home</a>
            </Link>
            <Link href="/gallery">
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Gallery</a>
            </Link>
            <Link href="/about">
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">About</a>
            </Link>
            <Link href="/contact">
              <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Contact</a>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Admin</a>
              </Link>
            )}
            <div className="px-4 py-2 space-y-2">
              {isAuthenticated ? (
                <Button onClick={logout} variant="outline" className="w-full">
                  Logout
                </Button>
              ) : (
                <Button onClick={() => window.location.href = getLoginUrl()} variant="default" className="w-full">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
