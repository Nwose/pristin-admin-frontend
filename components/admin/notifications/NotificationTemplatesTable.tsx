import React from "react";

const templates = [{ name: "Welcome New User" }, { name: "Account Update" }];

export default function NotificationTemplatesTable() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Notification Templates
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Template Name</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{t.name}</td>
                <td className="p-3 text-teal-600 font-medium">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <button className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700">
          Create New Template
        </button>
      </div>
    </div>
  );
}
