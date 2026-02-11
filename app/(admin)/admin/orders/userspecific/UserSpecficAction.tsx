"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Mail, Phone, Calendar, CreditCard } from "lucide-react";

/* ---------------- TYPES ---------------- */

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
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

/* ---------------- COMPONENT ---------------- */

export default function UserSpecificAction() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId"); // OPTIONAL

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [tx, setTx] = useState<Transaction | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    console.log(userId);
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/admin/transactions/userspecific?userId=${userId}&orderId=${orderId ?? ""}`,
        );

        if (res.data.success) {
          const d = res.data.details;

          setUser(
            Array.isArray(d.userDetails) ? d.userDetails[0] : d.userDetails,
          );

          setTx(
            d.specificTransaction
              ? Array.isArray(d.specificTransaction)
                ? d.specificTransaction[0]
                : d.specificTransaction
              : null,
          );

          setHistory(d.allTransactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, orderId]);

  /* ---------------- HELPERS ---------------- */

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);

  const filteredHistory = useMemo(() => {
    return history.filter(
      (t) =>
        t.order_id.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [history, search]);

  /* ---------------- GUARDS ---------------- */

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user)
    return <div className="p-10 text-center text-red-500">User not found</div>;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* USER DETAILS */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="flex gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ID: {user.id}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid md:grid-cols-3 gap-6 pt-4">
          <Info icon={<Mail />} label="Email" value={user.email} />
          <Info icon={<Phone />} label="Phone" value={user.phone || "N/A"} />
          <Info
            icon={<Calendar />}
            label="Joined"
            value={format(new Date(user.createdAt), "PPP")}
          />
        </CardContent>
      </Card>

      {/* SPECIFIC TRANSACTION (ONLY IF orderId EXISTS) */}
      {tx && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Transaction Details</CardTitle>
            <CardDescription>Details for requested transaction</CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <Field label="Order ID" value={tx.order_id} mono />
            <Field
              label="Amount"
              value={formatCurrency(tx.amount, tx.currency)}
              big
            />
            <Field label="System ID" value={tx.id} mono />
            <Field label="Status" value={tx.order_status} danger />
          </CardContent>
        </Card>
      )}

      {/* TRANSACTION HISTORY */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Transaction History</CardTitle>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Search Order / System ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Badge variant="secondary">
                {filteredHistory.length} Records
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>System ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow
                  key={item.id}
                  className={item.id === tx?.id ? "bg-red-50" : ""}
                >
                  <TableCell className="font-mono">
                    {item.order_id}
                    {item.id === tx?.id && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs border-red-300 text-red-600"
                      >
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount, item.currency)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.order_status}
                  </TableCell>
                </TableRow>
              ))}

              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-muted rounded">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

const Field = ({
  label,
  value,
  mono,
  big,
  danger,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  big?: boolean;
  danger?: boolean;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={[
        mono && "font-mono",
        big && "text-2xl font-bold",
        danger && "text-red-600 font-medium",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value ?? "N/A"}
    </p>
  </div>
);
