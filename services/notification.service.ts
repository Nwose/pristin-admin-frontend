import { makeRequest } from "./base";

export type Category = "loan" | "investment" | "system";

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  category: Category;
  date: string;
  isRead: boolean;
};

// Fetch notifications from real API
export const getNotifications = async (): Promise<NotificationType[]> => {
  const data = await makeRequest<NotificationType[]>(
    "/api/v1/admin/just_testing/",
    "GET"
  );
  // Ensure data is always an array
  return Array.isArray(data) ? data : [];
};
