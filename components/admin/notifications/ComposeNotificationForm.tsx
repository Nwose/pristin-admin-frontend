import React from "react";

export default function ComposeNotificationForm() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Compose Notification
      </h2>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter notification title"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Enter notification message"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Target Audience
          </label>
          <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none">
            <option>Investment users</option>
            <option>Loan users</option>
            <option>Waitlist users</option>
            <option>Active users</option>
            <option>Newsletter subscribers</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          {["In-App", "Email", "SMS"].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input type="checkbox" className="accent-teal-600" />
              <span>{type}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700"
          >
            Send Notification
          </button>
          <button
            type="button"
            className="border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100"
          >
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
}
