"use client";

import React from "react";
import ComposeNotificationForm from "./ComposeNotificationForm";
import SentNotificationsTable from "./SentNotificationTable";
import NotificationTemplatesTable from "./NotificationTemplatesTable";

export default function NotificationPage() {
  return (
    <section className="p-6 space-y-10 bg-gray-50 min-h-screen max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

      <ComposeNotificationForm />
      <SentNotificationsTable />
      <NotificationTemplatesTable />
    </section>
  );
}
