// services/files.service.ts
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("access_token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/files/`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }

  return res.json();
}
