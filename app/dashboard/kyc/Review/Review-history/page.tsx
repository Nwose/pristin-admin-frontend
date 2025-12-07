"use client";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

const ReviewHistoryPage = () => {
  const router = useRouter();

  const reviews = [
    {
      date: "2024-07-26",
      admin: "Admin 1",
      action: "Approved",
      comment: "Documents verified successfully.",
    },
    {
      date: "2024-07-25",
      admin: "Admin 2",
      action: "Rejected",
      comment: "Missing proof of address.",
    },
    {
      date: "2024-07-24",
      admin: "Admin 1",
      action: "Approved",
      comment: "All information is correct.",
    },
    {
      date: "2024-07-23",
      admin: "Admin 3",
      action: "Rejected",
      comment: "Incomplete application.",
    },
    {
      date: "2024-07-22",
      admin: "Admin 2",
      action: "Approved",
      comment: "ID verified.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Title + Back */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Review KYC Submission</h1>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b mb-8 text-sm font-medium">
          <button
            onClick={() => router.push("/admin/kyc/Review")}
            className="text-gray-500 hover:text-gray-700 pb-2"
          >
            User Details
          </button>
          <button
            onClick={() => router.push("/admin/kyc/Review/kyc-doc")}
            className="text-gray-500 hover:text-gray-700 pb-2"
          >
            KYC Documents
          </button>
          <button className="border-b-2 border-[#003366] text-[#003366] pb-2">
            Review History
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#F9FAFB] border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-white border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Admin Name</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Comments</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{r.date}</td>
                  <td className="px-6 py-4">{r.admin}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-white text-xs font-semibold rounded-md ${
                        r.action === "Approved" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {r.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600">{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ReviewHistoryPage;
