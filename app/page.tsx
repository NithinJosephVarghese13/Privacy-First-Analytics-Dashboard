import Link from "next/link";
import { BarChart3, Shield, Brain, Lock, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track pageviews, clicks, and user behavior with beautiful charts",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Anonymized tracking with consent management and data deletion",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Ask questions in natural language, powered by GPT-4",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Lock,
    title: "Secure Auth",
    description: "OAuth and Passkey support via NextAuth",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <header className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Privacy-First Analytics
            <span className="block text-blue-600 dark:text-blue-400 mt-2">Built for Trust</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            GDPR-compliant analytics with AI-powered insights. Track what matters without compromising user privacy.
          </p>
          
          {/* CTA Buttons with clear hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              aria-label="Go to analytics dashboard"
            >
              View Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-6 sm:px-8 py-3.5 rounded-lg font-semibold border border-gray-200 dark:border-gray-800 transition-all"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <section 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
          aria-label="Platform features"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={index}
                className="group relative bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon with colored background */}
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-5`}>
                  <Icon 
                    className={`w-6 h-6 ${feature.color}`} 
                    aria-hidden="true"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}