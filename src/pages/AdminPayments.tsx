import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, CreditCard, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { toast } from "sonner";

interface PaymentRow {
  id: string;
  user_id: string;
  course_id: string;
  student_name: string;
  phone_number: string | null;
  payment_method: string;
  transaction_id: string | null;
  course_fee: number;
  slip_url: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

const AdminPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    supabase
      .from("payment_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPayments((data as PaymentRow[]) || []);
        setLoading(false);
      });
  };

  useEffect(fetchPayments, []);

  const filtered = payments.filter((p) => {
    const matchSearch =
      !search ||
      p.student_name.toLowerCase().includes(search.toLowerCase()) ||
      p.payment_method.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setUpdating(true);
    const updates: Record<string, unknown> = {
      status: action,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    };
    if (action === "rejected") updates.rejection_reason = rejectionReason;

    const { error } = await supabase.from("payment_submissions").update(updates).eq("id", id);
    if (error) toast.error("Failed: " + error.message);
    else {
      toast.success(`Payment ${action}!`);
      await supabase.from("payment_audit_log").insert({
        payment_submission_id: id,
        performed_by: user?.id || "",
        action,
        details: action === "rejected" ? rejectionReason : null,
      });
      setSelectedPayment(null);
      setRejectionReason("");
      fetchPayments();
    }
    setUpdating(false);
  };

  const statusColor = (s: string) => {
    if (s === "approved") return "bg-success/10 text-success border-success/20";
    if (s === "pending") return "bg-star/10 text-star border-star/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle className="w-3 h-3" />;
    if (s === "pending") return <Clock className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
  };

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-7 h-7" /> Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-nunito">
            {payments.length} total • {pendingCount} pending
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-card border-border/50 font-nunito"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="p-12 text-center text-muted-foreground font-nunito">
              No payments found.
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-nunito text-xs font-semibold">Student</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Amount</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Method</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Status</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold">Date</TableHead>
                    <TableHead className="font-nunito text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <p className="text-sm font-nunito font-semibold text-foreground">{p.student_name}</p>
                        {p.phone_number && <p className="text-[11px] text-muted-foreground">{p.phone_number}</p>}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat("my-MM").format(p.course_fee)} MMK
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] rounded-lg capitalize">
                          {p.payment_method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border gap-1 ${statusColor(p.status)}`}>
                          {statusIcon(p.status)} {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setSelectedPayment(p)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={(o) => !o && setSelectedPayment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-fredoka">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Student</p>
                  <p className="font-semibold">{selectedPayment.student_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-semibold">{new Intl.NumberFormat("my-MM").format(selectedPayment.course_fee)} MMK</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Method</p>
                  <p className="font-semibold capitalize">{selectedPayment.payment_method.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={`text-xs border ${statusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-border bg-muted">
                <img src={selectedPayment.slip_url} alt="Payment slip" className="w-full max-h-64 object-contain" />
              </div>

              {selectedPayment.status === "pending" && (
                <div className="space-y-3 pt-2 border-t">
                  <Textarea
                    placeholder="Rejection reason (optional)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-success hover:bg-success/90 text-primary-foreground"
                      onClick={() => handleAction(selectedPayment.id, "approved")}
                      disabled={updating}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleAction(selectedPayment.id, "rejected")}
                      disabled={updating}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              )}

              {selectedPayment.rejection_reason && (
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-xs text-muted-foreground">Rejection Reason</p>
                  <p className="text-sm text-destructive">{selectedPayment.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPayments;
