import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Smartphone,
  Image,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { uploadPaymentSlip, submitPayment } from "@/services/paymentService";
import { toast } from "sonner";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
    category: string;
  };
  priceMMK: number;
}

type PaymentMethod = "kbz_pay" | "aya_pay" | "uab_pay";

const paymentMethods: { id: PaymentMethod; name: string; color: string }[] = [
  { id: "kbz_pay", name: "KBZ Pay", color: "bg-secondary" },
  { id: "aya_pay", name: "AYA Pay", color: "bg-accent" },
  { id: "uab_pay", name: "UAB Pay", color: "bg-primary" },
];

type Step = "payment" | "upload" | "confirmation";

export function CheckoutDialog({ open, onOpenChange, course, priceMMK }: CheckoutDialogProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("payment");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("kbz_pay");
  const [studentName, setStudentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatMMK = (amount: number) => {
    return new Intl.NumberFormat("my-MM").format(amount) + " MMK";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, slip: "File size must be under 5MB" }));
        return;
      }
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, slip: "" }));
    }
  };

  const validateUpload = () => {
    const newErrors: Record<string, string> = {};
    if (!studentName.trim()) newErrors.studentName = "Student name is required";
    if (!slipFile) newErrors.slip = "Payment slip is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateUpload() || !user || !slipFile) return;

    setIsSubmitting(true);
    try {
      const slipPath = await uploadPaymentSlip(user.id, slipFile);

      await submitPayment({
        user_id: user.id,
        course_id: course.id,
        student_name: studentName.trim(),
        phone_number: phoneNumber.trim() || undefined,
        payment_method: selectedMethod,
        transaction_id: transactionId.trim() || undefined,
        slip_url: slipPath,
        course_fee: priceMMK,
      });

      setCurrentStep("confirmation");
      toast.success("Payment slip submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep("payment");
    setStudentName("");
    setPhoneNumber("");
    setTransactionId("");
    setSlipFile(null);
    setSlipPreview(null);
    setErrors({});
    onOpenChange(false);
  };

  const steps = [
    { id: "payment", label: "Pay", icon: <Smartphone className="w-4 h-4" /> },
    { id: "upload", label: "Upload", icon: <Upload className="w-4 h-4" /> },
    { id: "confirmation", label: "Done", icon: <CheckCircle className="w-4 h-4" /> },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="gradient-primary p-6 text-primary-foreground">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-fredoka flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Enroll in Course
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                      index < currentStepIndex
                        ? "bg-primary-foreground text-primary"
                        : index === currentStepIndex
                        ? "bg-primary-foreground text-primary scale-110"
                        : "bg-primary-foreground/30 text-primary-foreground/70"
                    )}
                  >
                    {index < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className={cn("text-xs mt-2 font-medium", index <= currentStepIndex ? "text-primary-foreground" : "text-primary-foreground/60")}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn("w-12 h-1 mx-2 rounded-full", index < currentStepIndex ? "bg-primary-foreground" : "bg-primary-foreground/30")} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Course Summary */}
          <Card className="mb-6 border-2 border-dashed border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center text-3xl">
                {course.thumbnail || "📚"}
              </div>
              <div className="flex-1">
                <h4 className="font-fredoka font-bold text-foreground">{course.title}</h4>
                <Badge variant="category" className="text-xs mt-1">{course.category}</Badge>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{formatMMK(priceMMK)}</div>
                <div className="text-xs text-muted-foreground">Course Fee</div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Payment Instructions */}
          {currentStep === "payment" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="font-fredoka font-bold text-foreground mb-3">Choose Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center font-semibold text-sm",
                        selectedMethod === method.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      )}
                    >
                      <Smartphone className="w-6 h-6 mx-auto mb-2" />
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-fredoka font-bold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Payment Instructions
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Transfer the exact course fee <strong className="text-foreground">{formatMMK(priceMMK)}</strong> to the provided account</li>
                  <li>Take a <strong className="text-foreground">screenshot</strong> of the payment slip</li>
                  <li>Upload the payment slip in the next step to confirm enrollment</li>
                </ol>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Total Amount</div>
                <div className="text-3xl font-fredoka font-bold text-primary">{formatMMK(priceMMK)}</div>
              </div>

              <Button variant="fun" size="lg" className="w-full" onClick={() => setCurrentStep("upload")}>
                I've Made the Payment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Upload Slip */}
          {currentStep === "upload" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(e) => { setStudentName(e.target.value); setErrors((p) => ({ ...p, studentName: "" })); }}
                  className={errors.studentName ? "border-destructive" : ""}
                />
                {errors.studentName && <p className="text-xs text-destructive">{errors.studentName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" placeholder="09xxxxxxxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (optional)</Label>
                <Input id="transactionId" placeholder="Enter transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Upload Payment Slip *</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {slipPreview ? (
                  <div className="relative border-2 border-primary/20 rounded-xl overflow-hidden">
                    <img src={slipPreview} alt="Payment slip" className="w-full max-h-48 object-contain bg-muted/30" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 transition-colors",
                      errors.slip ? "border-destructive" : "border-border hover:border-primary/40"
                    )}
                  >
                    <Image className="w-10 h-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload payment slip</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                  </button>
                )}
                {errors.slip && <p className="text-xs text-destructive">{errors.slip}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep("payment")} className="flex-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="fun" onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Submit for Verification</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-star/20 flex items-center justify-center">
                <Clock className="w-10 h-10 text-star" />
              </div>
              <h3 className="text-2xl font-fredoka font-bold text-foreground mb-2">
                ⏳ Pending Verification
              </h3>
              <p className="text-muted-foreground mb-4">
                Your payment slip has been submitted. Our team will review and verify your payment shortly.
              </p>
              <div className="bg-star/10 border border-star/20 rounded-xl p-4 text-sm text-left mb-4">
                <p className="font-medium text-foreground mb-2">What happens next?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Payment slip received</li>
                  <li>⏳ Admin team will verify your payment</li>
                  <li>🔓 Course will be unlocked after approval</li>
                  <li>🎉 You'll get full access to all lessons!</li>
                </ul>
              </div>
              <Button variant="fun" onClick={handleClose} className="w-full">
                Got it!
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
