"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition"
    >
      <ArrowLeft size={16} /> Go Back
    </button>
  );
};

export default GoBackButton;
