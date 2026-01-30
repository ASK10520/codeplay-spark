import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, User, ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  ageGroup: string;
}

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  price?: number;
}

type Step = "details" | "payment" | "confirmation";

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "details", label: "Details", icon: <User className="w-4 h-4" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  { id: "confirmation", label: "Confirmation", icon: <CheckCircle className="w-4 h-4" /> },
];

export function EnrollmentDialog({
  open,
  onOpenChange,
  course,
  price = 29.99,
}: EnrollmentDialogProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    parentName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateDetailsStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.childName.trim()) {
      newErrors.childName = "Child's name is required";
    }
    if (!formData.childAge) {
      newErrors.childAge = "Please select child's age";
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent/Guardian name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Valid card number is required";
    }
    if (!formData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Valid expiry (MM/YY) is required";
    }
    if (!formData.cvv.trim() || formData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === "details") {
      if (validateDetailsStep()) {
        setCurrentStep("payment");
      }
    } else if (currentStep === "payment") {
      if (validatePaymentStep()) {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep("confirmation");
        }, 2000);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("details");
    }
  };

  const handleComplete = () => {
    onOpenChange(false);
    navigate("/dashboard");
  };

  const handleClose = () => {
    // Reset form when closing
    setCurrentStep("details");
    setFormData({
      childName: "",
      childAge: "",
      parentName: "",
      email: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-fredoka flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Enroll in Course
            </DialogTitle>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                      index < currentStepIndex
                        ? "bg-white text-primary"
                        : index === currentStepIndex
                        ? "bg-white text-primary scale-110 shadow-lg"
                        : "bg-white/30 text-white/70"
                    )}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium",
                      index <= currentStepIndex ? "text-white" : "text-white/60"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2 rounded-full transition-all duration-300",
                      index < currentStepIndex ? "bg-white" : "bg-white/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Course Summary Card */}
          <Card className="mb-6 border-2 border-dashed border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center text-3xl">
                {course.thumbnail}
              </div>
              <div className="flex-1">
                <h4 className="font-fredoka font-bold text-foreground">
                  {course.title}
                </h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant="category" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="age" className="text-xs">
                    {course.ageGroup}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${price}</div>
                <div className="text-xs text-muted-foreground">one-time</div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {currentStep === "details" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name *</Label>
                  <Input
                    id="childName"
                    placeholder="Enter child's name"
                    value={formData.childName}
                    onChange={(e) => updateFormData("childName", e.target.value)}
                    className={errors.childName ? "border-destructive" : ""}
                  />
                  {errors.childName && (
                    <p className="text-xs text-destructive">{errors.childName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childAge">Child's Age *</Label>
                  <Select
                    value={formData.childAge}
                    onValueChange={(value) => updateFormData("childAge", value)}
                  >
                    <SelectTrigger className={errors.childAge ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(9)].map((_, i) => (
                        <SelectItem key={i} value={String(6 + i)}>
                          {6 + i} years old
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.childAge && (
                    <p className="text-xs text-destructive">{errors.childAge}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  placeholder="Enter parent/guardian name"
                  value={formData.parentName}
                  onChange={(e) => updateFormData("parentName", e.target.value)}
                  className={errors.parentName ? "border-destructive" : ""}
                />
                {errors.parentName && (
                  <p className="text-xs text-destructive">{errors.parentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === "payment" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Lock className="w-4 h-4" />
                Secure payment - Your information is encrypted
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    updateFormData("cardNumber", formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className={errors.cardNumber ? "border-destructive" : ""}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-destructive">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={(e) =>
                      updateFormData("expiry", formatExpiry(e.target.value))
                    }
                    maxLength={5}
                    className={errors.expiry ? "border-destructive" : ""}
                  />
                  {errors.expiry && (
                    <p className="text-xs text-destructive">{errors.expiry}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) =>
                      updateFormData(
                        "cvv",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    maxLength={4}
                    className={errors.cvv ? "border-destructive" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-xs text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={(e) => updateFormData("cardName", e.target.value)}
                  className={errors.cardName ? "border-destructive" : ""}
                />
                {errors.cardName && (
                  <p className="text-xs text-destructive">{errors.cardName}</p>
                )}
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Course Price</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-success flex items-center justify-center animate-bounce-gentle">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-fredoka font-bold text-foreground mb-2">
                🎉 Enrollment Complete!
              </h3>
              <p className="text-muted-foreground mb-4">
                {formData.childName} is now enrolled in <strong>{course.title}</strong>
              </p>
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-sm text-left mb-4">
                <p className="font-medium text-foreground mb-2">What's next?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Confirmation email sent to {formData.email}</li>
                  <li>✅ Course added to your dashboard</li>
                  <li>✅ Start learning right away!</li>
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {currentStep === "payment" && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            {currentStep !== "confirmation" ? (
              <Button
                variant="fun"
                onClick={handleNext}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : currentStep === "payment" ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${price.toFixed(2)}
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button variant="success" onClick={handleComplete} className="flex-1">
                <Sparkles className="w-4 h-4" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
