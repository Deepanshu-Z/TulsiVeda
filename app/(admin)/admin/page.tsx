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
  ArrowUpRight,
  MoreHorizontal,
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

import { useEffect, useState } from "react";
import axios from "axios";

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
];

const recentOrders = [
  {
    id: "#ORD-7821",
    customer: "John Smith",
    amount: "₹299",
    status: "completed",
    date: "2 min ago",
  },
];
// ✅ Dynamic Cards (MUST BE INSIDE COMPONENT)

const getStatusBadge = (status: string) => {
  const variants: Record<string, { className: string }> = {
    completed: {
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    pending: {
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    failed: {
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    cancelled: {
      className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
  };

  return variants[status] || variants.pending;
};
export type Order = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  order_status: string;
};

export default function Dashboard() {
  // ✅ API Stats State
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalOrders: 0,
    failedPayments: 0,
    cancelledOrders: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  // ✅ Loading State
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Stats from API
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/stats");

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.log("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Cards
  const statsCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalAmount.toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Failed Payments",
      value: stats.failedPayments.toString(),
      icon: XCircle,
    },
    {
      title: "Cancelled Orders",
      value: stats.cancelledOrders.toString(),
      icon: CreditCard,
    },
  ];

  // ✅ Payment Breakdown (Backend Accurate)
  const totalOrders = stats.totalOrders ?? 0;
  const failedPayments = stats.failedPayments ?? 0;
  const cancelledPayments = stats.cancelledOrders ?? 0;

  // Successful = Total - Failed - Cancelled
  const successfulPayments = Math.max(
    totalOrders - failedPayments - cancelledPayments,
    0,
  );

  // ✅ Dynamic Chart Data
  const paymentStatusData = [
    {
      name: "Successful",
      value: successfulPayments,
      color: "hsl(142, 76%, 36%)",
    },
    { name: "Failed", value: failedPayments, color: "hsl(0, 84%, 60%)" },
    {
      name: "Cancelled",
      value: cancelledPayments,
      color: "hsl(215, 14%, 34%)",
    },
  ].filter((item) => item.value > 0);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`/api/admin/getorders?limit=5&page=1`);
      if (response.data.success) setOrders(response.data.recentOrders);
      else console.log("error getting orders", response.data.error);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("YOUR RECENT ORDERS ARE: ", orders);
  }, [orders]);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AdminHub</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>

            <Button size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your business performance
          </p>
        </div>

        {/* ✅ Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>

                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-7 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trend</CardDescription>
                </div>

                <Tabs defaultValue="revenue">
                  <TabsList>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Pie */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Payment outcomes distribution</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      key={paymentStatusData.length}
                      data={paymentStatusData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={90}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions from store</CardDescription>
          </CardHeader>
          {orders?.length > 0 && (
            <CardContent className="space-y-4">
              {orders?.length > 0 && (
                <CardContent className="space-y-4">
                  {orders.map((order) => (
                    <div>
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>

                          <div>
                            {/* Order ID */}
                            <p className="font-medium">{order.order_id}</p>

                            {/* User ID */}
                            <p className="text-sm text-muted-foreground">
                              User: {order.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                          {/* Amount */}
                          <p className="font-medium">
                            ₹{order.amount.toFixed(2)}
                          </p>

                          {/* Status */}
                          <Badge variant="outline">{order.order_status}</Badge>

                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button>Show More</Button>
                </CardContent>
              )}
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
