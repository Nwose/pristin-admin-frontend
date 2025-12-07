// src/app/admin/users/page.tsx
import AdminHeader from "@/components/admin/AdminHeader";
import CustomerTable from "@/components/users/CustomerTable";

export default function AdminUser() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customers</p>
        </div>

        <CustomerTable />
      </main>
    </div>
  );
}
