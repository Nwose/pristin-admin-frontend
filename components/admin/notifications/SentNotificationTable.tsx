import React from "react";

const notifications = [
  {
    title: "New Feature Announcement",
    target: "All Users",
    channel: "In-App",
    date: "2024-01-15",
    status: "Delivered",
  },
  {
    title: "Account Verification Reminder",
    target: "Specific User",
    channel: "Email",
    date: "2024-01-10",
    status: "Failed",
  },
  {
    title: "Transaction Alert",
    target: "Tier 2",
    channel: "SMS",
    date: "2023-12-20",
    status: "Delivered",
  },
];

export default function SentNotificationsTable() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Sent Notifications
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Target</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Date Sent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{n.title}</td>
                <td className="p-3">{n.target}</td>
                <td className="p-3">{n.channel}</td>
                <td className="p-3">{n.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      n.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {n.status}
                  </span>
                </td>
                <td className="p-3 text-teal-600 font-medium">
                  {n.status === "Failed" ? "Resend" : "View Details"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
