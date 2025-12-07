"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScheduleForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("");
  const [channels, setChannels] = useState({
    inApp: true,
    email: false,
    sms: false,
  });

  const handleCheckboxChange = (name: string) => {
    setChannels((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input
          type="text"
          placeholder="Enter target audience"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Channels */}
      <div className="space-y-2">
        {[
          { id: "inApp", label: "In-App" },
          { id: "email", label: "Email" },
          { id: "sms", label: "SMS" },
        ].map((ch) => (
          <label key={ch.id} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={channels[ch.id as keyof typeof channels]}
              onChange={() => handleCheckboxChange(ch.id)}
              className="w-4 h-4 border-gray-300 rounded text-teal-600 focus:ring-teal-500"
            />
            <span>{ch.label}</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-2">
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 text-sm font-medium">
          Send Notification
        </button>
        <button
          onClick={() => router.push("/admin/notifications/schedule")}
          className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 text-sm font-medium"
        >
          Schedule
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => alert("Notification scheduled!")}
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 text-sm"
        >
          Schedule Now
        </button>
      </div>
    </div>
  );
}
