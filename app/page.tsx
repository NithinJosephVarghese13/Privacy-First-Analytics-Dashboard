import Link from "next/link";
import { BarChart3, Shield, Brain, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy-First Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            GDPR-compliant analytics with AI-powered insights
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-Time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track pageviews, clicks, and user behavior with beautiful charts
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">GDPR Compliant</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Anonymized tracking with consent management and data deletion
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <Brain className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions in natural language, powered by GPT-4
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <Lock className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Auth</h3>
            <p className="text-gray-600 dark:text-gray-300">
              OAuth and Passkey support via NextAuth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
