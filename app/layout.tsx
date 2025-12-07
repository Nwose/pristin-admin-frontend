import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { AuthProviderClient } from "@/lib/api/auth/AuthProviderClient";
import { BankProvider } from "@/lib/api/provider/BankProvider";
import { TierUpgradeProvider } from "@/lib/api/contexts/TierUpgradeContext";
import UpdateTierModal from "@/components/kyc/UpdateTierModal";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pristin Capital",
  description: "Secure loan and investment platform.",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AuthProviderClient>
          <BankProvider>
            <TierUpgradeProvider>
              {children}
              <UpdateTierModal />
            </TierUpgradeProvider>
          </BankProvider>
        </AuthProviderClient>


        {/* ✅ Toast notifications for success/error/info messages */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored" // 👈 gives nice visual feedback (green/red backgrounds)
        />
      </body>
    </html>
  );
}
