"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LoanProductsTable from "@/components/admin/loans/LoanProductsTable";
import { toast } from "react-toastify";
import * as loan_product_service from "@/services/loan_product.service";

export default function LoanProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Safely get token only on client
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  const fetchLoanProducts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await loan_product_service.getLoanProducts(token);
      const results = Array.isArray(data)
        ? data
        : data && "results" in data
        ? data.results
        : [];
      setProducts(Array.isArray(results) ? results : []);
    } catch (err: any) {
      console.error("❌ fetchLoanProducts error:", err);
      toast.error(err.message || "Error fetching loan products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLoanProducts();
    }
  }, [fetchLoanProducts, token]);

  return (
    <>
      <AdminHeader />
      <div className="p-4">
        <LoanProductsTable
          data={products}
          loading={loading}
          refreshData={fetchLoanProducts}
          token={token || ""}
        />
      </div>
    </>
  );
}
