"use client";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ExportControls() {
  const [loading, setLoading] = useState(false);

  const exportAsJpeg = async () => {
    const root = document.getElementById("analytics-root");
    if (!root) return alert("Analytics area not found");

    setLoading(true);
    try {
      const canvas = await html2canvas(root, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "analytics.jpeg";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Could not export as JPEG");
    } finally {
      setLoading(false);
    }
  };

  const exportAsPdf = async () => {
    const root = document.getElementById("analytics-root");
    if (!root) return alert("Analytics area not found");

    setLoading(true);
    try {
      const canvas = await html2canvas(root, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("analytics.pdf");
    } catch (err) {
      console.error(err);
      alert("Could not export as PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-6">
      <button
        onClick={exportAsJpeg}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm hover:bg-gray-50"
      >
        Export as JPEG
      </button>

      <button
        onClick={exportAsPdf}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm hover:bg-gray-50"
      >
        Export as PDF
      </button>
      {loading && <span className="text-sm text-gray-500">Exporting...</span>}
    </div>
  );
}
