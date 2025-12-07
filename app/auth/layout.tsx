import Link from "next/link";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";

interface AdminAuthLayoutProps {
  children: React.ReactNode;
}

export default function AdminAuthLayout({ children }: AdminAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        {/* Injected Form / Content */}
        {children}

        {/* Footer / Signup Link */}
        <div className="text-center mt-6">
          <p className="text-slate-700 text-sm">
            Don't have an account?{" "}
            <Link
              href={FrontendRoutes.register}
              className="underline hover:text-slate-800 font-medium"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
