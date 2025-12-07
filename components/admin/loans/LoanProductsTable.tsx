"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { makeRequest } from "@/services/base";

interface LoanProduct {
  id: string;
  name: string;
  interest_rate: number;
  min_amount?: number;
  max_amount?: number;
  minimum_amount?: number;
  maximum_amount?: number;
  tenure_months?: number;
  max_tenure_months?: number;
  description?: string | null;
  repayment_frequency?: string;
  risk_level_display?: string;
}

export default function LoanProductsTable({
  data,
  loading,
  refreshData,
  token,
}: {
  data: LoanProduct[];
  loading: boolean;
  refreshData: () => void;
  token: string;
}) {
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(
    null
  );
  const [creating, setCreating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<LoanProduct | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    interest_rate: "",
    min_amount: "",
    max_amount: "",
    tenure_months: "",
    description: "",
  });

  const readMin = (p: LoanProduct) => p.min_amount ?? p.minimum_amount;
  const readMax = (p: LoanProduct) => p.max_amount ?? p.maximum_amount;
  const readTenure = (p: LoanProduct) =>
    p.tenure_months ?? p.max_tenure_months ?? 0;

  const formatInterest = (v?: number) => {
    if (v === undefined || v === null) return "—";
    if (v <= 1) return `${(v * 100).toFixed(2)}%`;
    return `${v}%`;
  };

  // ---------- Create ----------
  const handleCreate = async () => {
    if (!newProduct.name.trim()) return toast.error("Please enter a name.");
    if (!newProduct.interest_rate || isNaN(Number(newProduct.interest_rate)))
      return toast.error("Please enter a valid interest rate.");

    const payload = {
      name: newProduct.name.trim(),
      description: newProduct.description?.trim() || "",
      interest_rate: parseFloat(newProduct.interest_rate),
      min_amount: Number(newProduct.min_amount) || 0,
      max_amount: Number(newProduct.max_amount) || 0,
      max_tenure_months: Number(newProduct.tenure_months) || 0,
      repayment_frequency: "MONTHLY",
      risk_level: "LOW",
      is_active: true,
    };

    try {
      setIsSaving(true);
      await makeRequest("loan-product/", "POST", payload, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Loan product created!");
      setCreating(false);
      setNewProduct({
        name: "",
        interest_rate: "",
        min_amount: "",
        max_amount: "",
        tenure_months: "",
        description: "",
      });
      refreshData();
    } catch (err: any) {
      console.error("Create error:", err);
      toast.error(err?.message || "Failed to create loan product.");
    } finally {
      setIsSaving(false);
    }
  };

  async function confirmDelete() {
    if (!deletingProduct) return;
    try {
      await makeRequest(
        `loan-product/${deletingProduct.id}/`,
        "DELETE",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Loan product deleted!");
      setDeletingProduct(null);
      refreshData();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete loan product.");
    }
  }

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading loan products...</p>
    );

  if (!data || data.length === 0)
    return <p className="text-center text-gray-500">No loan products found.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6">
      {" "}
      {/* ✅ Centered & spaced down */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Loan Products</h2>
        <button
          onClick={() => setCreating(true)}
          className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700 transition text-sm font-medium"
        >
          + New Loan Product
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Interest Rate</th>
              <th className="px-6 py-3">Min Amount</th>
              <th className="px-6 py-3">Max Amount</th>
              <th className="px-6 py-3">Tenure</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">
                  {formatInterest(product.interest_rate)}
                </td>
                <td className="px-6 py-3">{readMin(product) ?? "—"}</td>
                <td className="px-6 py-3">{readMax(product) ?? "—"}</td>
                <td className="px-6 py-3">{readTenure(product)}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => setDeletingProduct(product)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ✅ Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Loan Product</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Interest Rate (e.g. 0.05)"
                step="any"
                value={newProduct.interest_rate}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    interest_rate: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Min Amount"
                value={newProduct.min_amount}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, min_amount: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={newProduct.max_amount}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, max_amount: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Tenure (months)"
                value={newProduct.tenure_months}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    tenure_months: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setCreating(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete Loan Product</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{deletingProduct.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
