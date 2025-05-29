import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormatPrice } from "@/utils/formatPrice";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface DialogDepositAndMembershipProps {
  type: "Membership" | "deposit";
  amount: number;
  open: boolean;
  onClose: () => void;
  payment: {
    code: string;
    name: string;
  };
}

export function DialogDepositAndMembership({
  type,
  amount,
  payment,
  open,
  onClose,
}: DialogDepositAndMembershipProps) {
  const [loading, setLoading] = useState<boolean>(false);
  async function handlePost() {
    setLoading(true);
    try {
      const payload = {
        amount,
        code: payment.code,
        type
      };
      const req = await axios.post("/api/v1/deposit", payload);
      toast.success("create deposit successfully");
      return req.data;
    } catch (error) {
      toast.error("failed to create deposit");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "Membership" ? "Membership Payment" : "Deposit Payment"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium">{payment.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">{FormatPrice(amount)}</p>
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-between items-center gap-3 w-full">
          <Button onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button onClick={handlePost} disabled={loading} className="w-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
