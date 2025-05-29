import { useState } from "react";
import { DialogOrderManual } from "./dialog-order";
import { Button } from "@/components/ui/button";

export const HeaderOrderManual = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <section className="flex w-full items-center justify-between">
        <div className="">
          <h2 className="text-lg font-semibold text-foreground">
            Daftar Pesanan Manual
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola dan pantau pesanan reorder
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Create</Button>
      </section>
      {open && <DialogOrderManual open={open} onClose={() => setOpen(!open)} />}
    </>
  );
};
