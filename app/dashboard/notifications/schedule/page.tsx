"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ScheduleForm from "@/components/admin/notifications/ScheduleForm";
import CalendarPicker from "@/components/admin/notifications/CalenderPicker";

export default function ScheduleNotificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

        {/* Compose Section */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Compose Notification
          </h2>
          <ScheduleForm />
        </section>

        {/* Calendar Section */}
        <section className="mt-8">
          <CalendarPicker />
        </section>
      </main>
    </div>
  );
}
