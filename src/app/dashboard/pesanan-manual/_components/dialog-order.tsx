"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/types/category";
import { FormPesananManual } from "./form";

interface DialogOrderManualProps {
  open: boolean;
  onClose: () => void;
}

export function DialogOrderManual({ open, onClose }: DialogOrderManualProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full ">
        <DialogHeader>
          <DialogTitle>Create Manual Order</DialogTitle>
          <DialogDescription>Manual Order Details Form</DialogDescription>
        </DialogHeader>
        <FormPesananManual />
      </DialogContent>
    </Dialog>
  );
}
