"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DollarSign,
  CreditCard,
  XCircle,
  ShoppingCart,
  Download,
  Filter,
  Users,
  User,
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
} from "recharts";

import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// ---------------- TYPES ----------------
type Stats = {
  totalAmount: number;
  totalOrders: number;
  failedPayments: number;
  cancelledOrders: number;
};

type Order = {
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
    staleTime: 60_000,
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

  if (statsLoading || ordersLoading) return <p>Loading...</p>;
  if (statsError || ordersError) return <p>Something went wrong</p>;
  if (!stats) return null;

  // ---------------- DERIVED DATA ----------------
  const statsCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalAmount.toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Failed Payments",
      value: stats.failedPayments,
      icon: XCircle,
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: CreditCard,
    },
  ];

  const successfulPayments = Math.max(
    stats.totalOrders - stats.failedPayments - stats.cancelledOrders,
    0,
  );

  const paymentStatusData = [
    { name: "Successful", value: successfulPayments, color: "#22c55e" },
    { name: "Failed", value: stats.failedPayments, color: "#ef4444" },
    { name: "Cancelled", value: stats.cancelledOrders, color: "#64748b" },
  ].filter((i) => i.value > 0);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AdminHub</span>
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

      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((s) => (
            <Card key={s.title}>
              <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {s.title}
                </CardTitle>
                <s.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid gap-6 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    dataKey="revenue"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {paymentStatusData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ORDERS */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between p-3 rounded bg-muted/50"
              >
                <div>
                  <p className="font-medium">{order.order_id}</p>
                  <p className="text-sm text-muted-foreground">
                    User: {order.user_id.slice(0, 8)}...
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span>₹{order.amount.toFixed(2)}</span>
                  <Badge variant="outline">{order.order_status}</Badge>
                  <Link
                    href={`/admin/orders/userspecific?userId=${order.user_id}&orderId=${order.order_id}`}
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))}

            <Link href="/admin/orders">
              <Button className="mt-4">Show More</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
