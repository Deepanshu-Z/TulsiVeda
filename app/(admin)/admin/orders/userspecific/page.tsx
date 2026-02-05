"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { format } from "date-fns"; // Make sure you have date-fns installed
import {
  AlertCircle,
  Calendar,
  Copy,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// --- Types ---
interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  createdAt: string;
  emailVerified: string | null;
}

interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  order_status?: string;
  created_at?: string;
}

const TransactionDetailsPage = () => {
  const searchParams = useSearchParams();

  // Get IDs from URL query params
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId");

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [tx, setTx] = useState<Transaction | null>(null); // The specific/failed transaction
  const [history, setHistory] = useState<Transaction[]>([]); // All transactions

  // --- Helper Function ---
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);
  };

  useEffect(() => {
    if (!userId || !orderId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/admin/transactions/userspecific?userId=${userId}&orderId=${orderId}`,
        );

        if (response.data.success) {
          const details = response.data.details;

          const userData = Array.isArray(details.userDetails)
            ? details.userDetails[0]
            : details.userDetails;

          const specificTxData = Array.isArray(details.specificTransaction)
            ? details.specificTransaction[0]
            : details.specificTransaction;

          setUser(userData);
          setTx(specificTxData);
          setHistory(details.allTransactions || []);
        } else {
          console.error("API Error:", response.data.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId, orderId]);

  // --- Loading / Error Guard ---
  if (loading) {
    return <div className="p-10 text-center">Loading details...</div>;
  }

  if (!user) {
    return <div className="p-10 text-center text-red-500">User not found.</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto w-full">
      {/* SECTION 1: USER DETAILS */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-lg bg-primary/5">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {user.id}
                  </span>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm font-semibold">{user.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Joined
              </p>
              <p className="text-sm font-semibold">
                {user.createdAt
                  ? format(new Date(user.createdAt), "PPP")
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: SPECIFIC / FAILED TRANSACTION */}
      {tx && (
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <CardTitle className="text-lg">Transaction Details</CardTitle>
              </div>
            </div>
            <CardDescription className="text-red-600/80">
              Details regarding the specific transaction query.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-medium">
                    {tx.order_id}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Amount</span>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(tx.amount, tx.currency)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">System ID</span>
                <p className="font-mono text-sm">{tx.id}</p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <p className="font-medium text-red-600">{tx.order_status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 3: ALL USER TRANSACTIONS */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Transaction History</CardTitle>
            </div>
            <Badge variant="secondary">{history.length} Records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>System Ref</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow
                  key={item.id}
                  // Check if this row matches the specific/failed transaction ID
                  className={
                    item.id === tx?.id ? "bg-red-50 hover:bg-red-100" : ""
                  }
                >
                  <TableCell className="font-medium font-mono">
                    {item.order_id}
                    {item.id === tx?.id && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-[10px] h-5 border-red-200 text-red-600"
                      >
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount, item.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailsPage;
