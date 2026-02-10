import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionTitle } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Shield,
  Eye,
  Filter,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllPaymentSubmissions,
  approvePayment,
  rejectPayment,
  getSignedSlipUrl,
  type PaymentSubmissionWithCourse,
} from "@/services/paymentService";
import { toast } from "sonner";

const AdminPayments = () => {
  const navigate = useNavigate();
  const { user, hasRole, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<PaymentSubmissionWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  // Action modals
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; submission: PaymentSubmissionWithCourse } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Image preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !hasRole("admin"))) {
      navigate("/");
      return;
    }
    if (user && hasRole("admin")) {
      fetchSubmissions();
    }
  }, [user, authLoading]);

  const fetchSubmissions = async () => {
    try {
      const data = await getAllPaymentSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirmAction || !user) return;
    setActionLoading(true);
    try {
      await approvePayment(confirmAction.submission.id, user.id);
      toast.success("Payment approved! Course unlocked for student.");
      setConfirmAction(null);
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirmAction || !user) return;
    setActionLoading(true);
    try {
      await rejectPayment(confirmAction.submission.id, user.id, rejectReason);
      toast.success("Payment rejected.");
      setConfirmAction(null);
      setRejectReason("");
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewSlip = async (slipUrl: string) => {
    setPreviewLoading(true);
    try {
      const url = await getSignedSlipUrl(slipUrl);
      setPreviewUrl(url);
    } catch {
      toast.error("Failed to load payment slip image");
    } finally {
      setPreviewLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-star/20 text-star border-star/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-success/20 text-success border-success/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const methodLabel = (m: string) => {
    const map: Record<string, string> = { kbz_pay: "KBZ Pay", aya_pay: "AYA Pay", uab_pay: "UAB Pay" };
    return map[m] || m;
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone_number && s.phone_number.includes(searchQuery));
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesMethod = methodFilter === "all" || s.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <Section>
          <SectionTitle subtitle="Review and manage student payment verifications">
            <Shield className="w-6 h-6 inline mr-2" />
            Payment Verification Dashboard
          </SectionTitle>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="kbz_pay">KBZ Pay</SelectItem>
                <SelectItem value="aya_pay">AYA Pay</SelectItem>
                <SelectItem value="uab_pay">UAB Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-fredoka font-bold text-star">{submissions.filter((s) => s.status === "pending").length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-fredoka font-bold text-success">{submissions.filter((s) => s.status === "approved").length}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-fredoka font-bold text-destructive">{submissions.filter((s) => s.status === "rejected").length}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent></Card>
          </div>

          {/* Submissions List */}
          {filtered.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-muted-foreground">
              No payment submissions found.
            </CardContent></Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((s) => (
                <Card key={s.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-fredoka font-bold text-foreground truncate">{s.student_name}</h4>
                          {getStatusBadge(s.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {s.courses?.title || "Unknown Course"} • {methodLabel(s.payment_method)}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                          {s.phone_number && <span>📱 {s.phone_number}</span>}
                          {s.transaction_id && <span>🔖 {s.transaction_id}</span>}
                          <span>💰 {new Intl.NumberFormat("my-MM").format(s.course_fee)} MMK</span>
                          <span>📅 {new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                        {s.rejection_reason && (
                          <p className="text-xs text-destructive mt-1">Reason: {s.rejection_reason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => handleViewSlip(s.slip_url)}>
                          <Eye className="w-4 h-4" /> View Slip
                        </Button>
                        {s.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90 text-primary-foreground"
                              onClick={() => setConfirmAction({ type: "approve", submission: s })}
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmAction({ type: "reject", submission: s })}
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-fredoka">
              {confirmAction?.type === "approve" ? "✅ Approve Payment" : "❌ Reject Payment"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "approve"
                ? `Approve payment from ${confirmAction?.submission.student_name}? This will unlock the course for them.`
                : `Reject payment from ${confirmAction?.submission.student_name}?`}
            </DialogDescription>
          </DialogHeader>
          {confirmAction?.type === "reject" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Rejection reason (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setConfirmAction(null)} className="flex-1" disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction?.type === "approve" ? handleApprove : handleReject}
              disabled={actionLoading}
              className={cn("flex-1", confirmAction?.type === "approve" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90", "text-primary-foreground")}
            >
              {actionLoading ? "Processing..." : confirmAction?.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-fredoka">Payment Slip</DialogTitle>
          </DialogHeader>
          {previewLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Payment slip" className="w-full rounded-lg" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
