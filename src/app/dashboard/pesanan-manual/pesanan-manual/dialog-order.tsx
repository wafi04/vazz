"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Category } from "@/types/category";
import { ReactNode, useState } from "react";

interface DialogOrderManualProps {
  data?: Category[];
  open: boolean;
  onClose: () => void;
}

export function DialogOrderManual({ data }: DialogOrderManualProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent></DialogContent>
    </Dialog>
  );
}

function SelectComponent({
  data,
}: {
  data: { name: string; value: string }[];
}) {
  const [state, setState] = useState();
}
