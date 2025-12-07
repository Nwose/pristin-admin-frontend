"use client";

import React, { useEffect, useState, useMemo } from "react";
import { UserService } from "@/services/user.service";

// --------------------------------------
// TYPES
// --------------------------------------
type Customer = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  date_joined: string;
  kyc_status: "View" | "Rejected" | string;
};

// --------------------------------------
// BADGE COMPONENTS
// --------------------------------------
function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const colors =
    status === "Active"
      ? "bg-green-500 text-white"
      : "bg-yellow-500 text-white";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors}`}>
      {status}
    </span>
  );
}

function KYCAction({ kyc }: { kyc: string }) {
  return (
    <span
      className={`text-sm font-medium ${
        kyc === "Rejected" ? "text-red-500" : "text-blue-600"
      } cursor-pointer`}
    >
      {kyc}
    </span>
  );
}

// --------------------------------------
// MAIN COMPONENT
// --------------------------------------
export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // --------------------------------------
  // LOAD USERS FROM API
  // --------------------------------------
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data: any = await UserService.getUsers();

      const formatted = (data?.results || []).map((u: any) => ({
        id: u.id,
        name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "Unknown",
        email: u.email,
        status: u.is_active ? "Active" : "Inactive",
        date_joined: u.date_joined,
        kyc_status: u.kyc_status ?? "View",
      }));

      setCustomers(formatted);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------
  // FILTERING + SEARCH + SORTING
  // --------------------------------------
  const filtered = useMemo(() => {
    let data = [...customers];

    // search
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s)
      );
    }

    // status filter
    if (statusFilter) {
      data = data.filter((c) => c.status === statusFilter);
    }

    // date filter
    if (dateFilter === "Newest") {
      data = data.sort(
        (a, b) =>
          new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime()
      );
    } else if (dateFilter === "Oldest") {
      data = data.sort(
        (a, b) =>
          new Date(a.date_joined).getTime() - new Date(b.date_joined).getTime()
      );
    }

    return data;
  }, [customers, search, statusFilter, dateFilter]);

  // --------------------------------------
  // PAGINATION LOGIC
  // --------------------------------------
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalPages = Math.ceil(filtered.length / perPage);

  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function prevPage() {
    if (page > 1) setPage(page - 1);
  }

  // --------------------------------------
  // RENDER
  // --------------------------------------
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mx-auto mt-6 p-4">
      {/* SEARCH INPUT */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search by name, email, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"
        />

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">Filter by Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">Filter by Date Joined</option>
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto mt-5">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading customers...</p>
        ) : paginated.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No customers found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date Joined</th>
                <th className="px-6 py-3">KYC</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginated.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cust.name}</td>
                  <td className="px-6 py-4 text-blue-600">{cust.email}</td>
                  <td className="px-6 py-4">{cust.id}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={cust.status} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(cust.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <KYCAction kyc={cust.kyc_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
          <p>
            Showing {(page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
            customers
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
            >
              Prev
            </button>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
