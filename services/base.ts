import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔹 Legacy-style request helper
export async function send(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${BASE_URL?.replace(/\/+$/, "")}/${endpoint.replace(
    /^\/+/,
    ""
  )}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    toast.error("Session expired. Please log in again.");
    localStorage.removeItem("access_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("BACKEND RAW ERROR:", data);

    const msg =
      data?.detail ||
      data?.message ||
      (typeof data === "string" ? data : "Something went wrong");

    toast.error(msg);
    throw new Error(msg);
  }

  return data;
}

// 🔹 Modern universal API helper
export async function makeRequest<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  const fullUrl = `${BASE_URL?.replace(/\/+$/, "")}/${endpoint.replace(
    /^\/+/,
    ""
  )}`;
  console.log("📡 API CALL →", method, fullUrl);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "follow",
    });

    const text = await res.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text.trim().substring(0, 200) };
    }

    if (res.status === 401) {
      toast.error("Session expired. Logging out...");
      localStorage.removeItem("access_token");
      window.location.href = "/admin/login";
      return Promise.reject(new Error("Unauthorized"));
    }

    if (!res.ok) {
      console.error("📌 BACKEND RAW ERROR:", data);
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        data?.non_field_errors?.[0] ||
        `HTTP ${res.status} Error`;

      toast.error(message);
      console.warn("❌ Request failed:", res.status, fullUrl);
      return Promise.reject(new Error(message));
    }

    return data as T;
  } catch (err: any) {
    toast.error("Network error. Please check your connection.");
    console.error("⚠️ Network/Parse Error:", err);
    throw err;
  }
}
