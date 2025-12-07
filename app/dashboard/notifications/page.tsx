import NotificationPage from "@/components/admin/notifications/NotificationPage";
import { useAuth } from "@/lib/api/auth/authContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  return <NotificationPage />;
}
