import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, AlertCircle } from "lucide-react";

export function ButtonReOrder({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reorder
      </Button>
      <DialogReorder
        onClose={() => setOpen(false)}
        open={open}
        orderId={orderId}
      />
    </>
  );
}

export function DialogReorder({
  open,
  onClose,
  orderId,
}: {
  open: boolean;
  onClose: () => void;
  orderId: string;
}) {
  const [createdBy, setCreatedBy] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const payload = {
    orderId,
    createdBy,
    reason,
  };

  async function Reorder(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    if (!createdBy.trim() || !reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const req = await axios.post("/api/v1/re-transaction", payload);
      toast.success("Reorder request submitted successfully!");
      onClose();
      // Reset form
      setCreatedBy("");
      setReason("");
      return req.data;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit reorder request"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-card-foreground font-semibold text-xl flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Reorder Request
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please provide the reason for requesting a reorder of this
            transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={Reorder} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label
              htmlFor="createdBy"
              className="text-card-foreground font-medium"
            >
              Created by <span className="text-destructive">*</span>
            </Label>
            <Input
              id="createdBy"
              value={createdBy}
              placeholder="Enter your name"
              onChange={(e) => setCreatedBy(e.target.value)}
              className="bg-background border-input focus:border-ring focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-card-foreground font-medium"
            >
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you need to reorder..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-background border-input focus:border-ring focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground min-h-24 resize-none"
              required
            />
          </div>

          {/* Order ID Display */}
          <div className="space-y-2">
            <Label className="text-card-foreground font-medium">Order ID</Label>
            <div className="px-3 py-2 bg-muted rounded-md border border-border">
              <span className="text-muted-foreground text-sm font-mono">
                {orderId}
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-input bg-background hover:bg-muted text-card-foreground"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !createdBy.trim() || !reason.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
