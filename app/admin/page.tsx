"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visitorHash, setVisitorHash] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !session?.user?.roles?.includes("admin")) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleDeleteData = async () => {
    if (!visitorHash.trim()) return;

    try {
      const response = await fetch(`/api/users/${visitorHash}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Data deleted successfully");
        setVisitorHash("");
        setShowDeleteConfirm(false);
      } else {
        alert("Failed to delete data");
      }
    } catch (error) {
      alert("Error deleting data");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !session.user.roles?.includes("admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users and GDPR compliance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-600" />
              Data Deletion (GDPR)
            </h2>

            <div className="mb-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    This action will permanently delete all events associated with a visitor hash.
                    This fulfills the GDPR "Right to Erasure" requirement.
                  </div>
                </div>
              </div>

              <label className="block mb-2 dark:text-white">Visitor Hash:</label>
              <input
                type="text"
                value={visitorHash}
                onChange={(e) => setVisitorHash(e.target.value)}
                placeholder="Enter visitor hash to delete"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={!visitorHash.trim()}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
              >
                Request Deletion
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteData}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">System Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Your Role:</p>
                <p className="font-medium dark:text-white">
                  {session.user.roles?.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email:</p>
                <p className="font-medium dark:text-white">{session.user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status:</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
