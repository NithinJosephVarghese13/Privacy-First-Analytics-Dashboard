"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Sign In
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium"
          >
            <Github className="w-6 h-6" />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our privacy-first approach. 
          We only collect anonymized analytics data.
        </p>
      </div>
    </div>
  );
}
