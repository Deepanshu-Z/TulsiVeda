"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  CreditCard,
  XCircle,
  ShoppingCart,
  Download,
  Filter,
  User,
  ReceiptIndianRupee,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// ---------------- TYPES ----------------
type MonthlyData = {
  month: string;
  total: number;
};
type Stats = {
  totalAmount: number;
  totalOrders: number;
  failedPayments: number;
  cancelledOrders: number;
  createdOrders: number;
  monthlyRevenue: MonthlyData[];
};

export type Order = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  order_status: string;
};

// ---------------- FETCHERS ----------------
const fetchStats = async (): Promise<Stats> => {
  const res = await axios.get("/api/admin/stats");
  if (!res.data.success) throw new Error("Stats fetch failed");
  return res.data.stats;
};

const fetchOrders = async (): Promise<Order[]> => {
  const res = await axios.get(
    "/api/admin/getorders?limit=5&page=1&statusFilter=ALL",
  );
  if (!res.data.success) throw new Error("Orders fetch failed");
  return res.data.recentOrders;
};

// ---------------- STATIC DATA ----------------
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
];

// ---------------- COMPONENT ----------------
export default function Dashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery<Stats>({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
    staleTime: 60_000,
  });

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg animate-pulse text-muted-foreground">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (statsError || ordersError || !stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">
          Failed to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  const totalOrdersCount = Number(stats.totalOrders) || 0;
  const failedCount = Number(stats.failedPayments) || 0;
  const cancelledCount = Number(stats.cancelledOrders) || 0;
  const createdCount = Number(stats.createdOrders) || 0;
  // Logical calculation for "Successful"
  const successfulPayments = Math.max(
    totalOrdersCount - failedCount - cancelledCount - createdCount,
    0,
  );

  const statsCards = [
    {
      title: "Paid Orders Value",
      value: `₹${Number(stats.totalAmount).toLocaleString("en-IN")}`,
      icon: ReceiptIndianRupee,
    },

    {
      title: "Total Orders",
      value: totalOrdersCount,
      icon: ShoppingCart,
    },
    {
      title: "Total Paid Orders ",
      value: successfulPayments,
      icon: ReceiptIndianRupee,
    },
    {
      title: "Failed Payments",
      value: failedCount,
      icon: XCircle,
    },
    {
      title: "Cancelled Orders",
      value: cancelledCount,
      icon: CreditCard,
    },
    {
      title: "Pending Orders",
      value: createdCount,
      icon: CreditCard,
    },
  ];

  const paymentStatusData = [
    { name: "Successful", value: successfulPayments, color: "#22c55e" },
    { name: "Failed", value: failedCount, color: "#ef4444" },
    { name: "Cancelled", value: cancelledCount, color: "#64748b" },
  ].filter((i) => i.value > 0); // Recharts requires filtering 0 values for Pie stability

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminHub</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filters
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* STATS CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((s) => (
            <Card
              className="transition-transform duration-300 hover:scale-110"
              key={s.title}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.title}
                </CardTitle>
                <s.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid gap-6 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Growth</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last 4 months performance
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyRevenue}>
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                        });
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      }
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payment Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT ORDERS TABLE-LIKE LIST */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No recent orders found.
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card transition-hover hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <p className="font-semibold leading-none">
                      {order.order_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User ID: {order.user_id.slice(0, 12)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        ₹{Number(order.amount).toFixed(2)}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase"
                      >
                        {order.order_status}
                      </Badge>
                    </div>
                    <Link
                      href={`/admin/orders/userspecific?userId=${order.user_id}&orderId=${order.order_id}`}
                    >
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
