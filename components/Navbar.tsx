"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, MessageSquare, Shield, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Analytics</span>
          </Link>

          <div className="flex items-center gap-4">
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                    isActive("/dashboard")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/chat"
                  className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                    isActive("/chat")
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Chat
                </Link>

                {session.user.roles?.includes("admin") && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                      isActive("/admin")
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}

            {!session && (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
