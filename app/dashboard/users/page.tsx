// src/app/admin/users/page.tsx
import CustomerTable from "@/components/users/CustomerTable";
import { useAuth } from "@/lib/api/auth/authContext";

export default function AdminUser() {
  const { user } = useAuth();
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customers</p>
      </div>

      <CustomerTable />
    </>
  );
}
