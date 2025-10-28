"use client";

import { useState, useEffect } from "react";

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = document.cookie.includes("analytics_consent=true");
    const hasDecided = document.cookie.includes("analytics_consent");
    
    if (!hasDecided) {
      setShowBanner(true);
    } else {
      setConsent(storedConsent);
    }
  }, []);

  const handleConsent = async (granted: boolean) => {
    document.cookie = `analytics_consent=${granted}; path=/; max-age=${365 * 24 * 60 * 60}`;
    setConsent(granted);
    setShowBanner(false);

    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: granted ? "grant" : "revoke" }),
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to analyze website usage and improve your experience. 
            We only track anonymized data and never collect personal information. 
            Your data is GDPR compliant.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleConsent(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Decline
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
