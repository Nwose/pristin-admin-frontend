"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ViolationDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };

  // Mock user data (replace with real data later)
  const user = {
    name: "Amelia Harper",
    email: "amelia.harper@email.com",
    accountId: "123456789",
    role: "User",
    violationType: "Community Guidelines",
    reportedDate: "2024-01-15",
    description: "Inappropriate content posted in a public forum.",
    evidenceText: "Screenshot of the offending post.",
    submitterId: "987654321",
    images: ["/images/imageVio1.png", "/images/imageVio2.png"],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Keep the Admin header visible */}
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Top back arrow */}

        {/* Page title and top back button */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Violation Details
          </h1>

          <button
            onClick={() => router.push("/admin/kyc")}
            className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE - Information + Review */}
          <div className="space-y-10">
            {/* User Information */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                User Information
              </h2>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Full Name:</span>{" "}
                  {user.name}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Account ID:</span>{" "}
                  {user.accountId}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Role:</span>{" "}
                  {user.role}
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    router.push(
                      `/admin/kyc/violation-details/${id}/user-profile`
                    )
                  }
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm bg-teal-500 text-white shadow-sm hover:bg-teal-600 transition"
                >
                  View Profile
                </button>
              </div>
            </section>

            {/* Review */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Review
              </h3>

              <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
                <p>
                  <span className="font-medium text-gray-700">
                    Violation Type:
                  </span>{" "}
                  {user.violationType}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Date Reported:
                  </span>{" "}
                  {user.reportedDate}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Description:
                  </span>{" "}
                  {user.description}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Evidence:</span>{" "}
                  {user.evidenceText}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Submitter ID:
                  </span>{" "}
                  {user.submitterId}
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => alert("Open evidence (mock)")}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View Evidence
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE - Images */}
          <aside className="space-y-6">
            {user.images.map((src, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={src}
                  alt={`evidence-${idx}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
