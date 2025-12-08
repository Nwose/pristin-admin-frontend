"use client";
import NotificationPage from "@/components/admin/notifications/NotificationPage";
import { useAuth } from "@/lib/api/auth/authContext";
import { use } from "react";

export default function NotificationsPage() {
  const { user } = useAuth();
  return <NotificationPage />;
}
