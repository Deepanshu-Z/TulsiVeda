"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { useEffect, useState } from "react";
import { Order } from "../page";
import Link from "next/link";

const LIMIT = 10;

const Page = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    failed: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "paid" | "failed" | "cancelled"
  >("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/admin/getorders?page=${page}&limit=${LIMIT}&statusFilter=${statusFilter}`,
        );

        if (res.data.success) {
          setOrders(res.data.recentOrders);
          setTotalPages(res.data.meta.totalPages);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

  const fetchUserDetails = async (userId: string, orderId: string) => {
    const response = await axios.get(
      `/api/admin/transactions/userspecific?userId=${userId}&orderId=${orderId}`,
    );
    if (response.data.success) {
      console.log(
        "User Details: ",
        response.data.details.userDetails,
        "Specific Transaction details: ",
        response.data.details.specificTransaction,
        "All Transaction Performed by user details: ",
        response.data.details.allTransactions,
      );
    } else console.log("ERROR:!!!!!!!!", response.data.error);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-4 ml-4">
        <h2 className="text-lg font-bold">Orders</h2>

        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded-md px-3 py-1 text-sm font-semibold"
          >
            <option value="ALL">All</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded-md px-3 py-1 text-sm font-semibold"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {loading && (
          <p className="text-sm text-muted-foreground font-semibold">
            please wait Loading...
          </p>
        )}

        {!loading && orders?.length === 0 && (
          <p className="text-sm text-muted-foreground font-semibold">
            No orders found
          </p>
        )}

        {!loading &&
          orders?.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
            >
              {/* Left */}
              <div>
                <p className="font-bold text-base">{order.order_id}</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  User: {order.user_id}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <p className="font-bold">₹{order.amount}</p>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    statusStyles[order.order_status] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.order_status}
                </span>

                {/* Show More */}
                <Link
                  href={`/admin/orders/userspecific?userId=${order.user_id}&orderId=${order.order_id}`}
                >
                  <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                    Show details
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 2), page + 1)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Page;
