// components/vouchers/VoucherTable.tsx
"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { VoucherForm } from "./voucher-form";
import { DeleteDialogVoucher } from "./dialog/delete-dialog";
import { Voucher } from "@/types/voucher";
import { VoucherRow } from "./voucher-row";

interface VoucherTableProps {
  vouchers: Voucher[];
}

export function VoucherTable({ vouchers }: VoucherTableProps): JSX.Element {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsFormOpen(true);
  };

  const handleDelete = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteOpen(true);
  };

  const toggleRow = (voucherId: number) => {
    setExpandedRows((prev) =>
      prev.includes(voucherId)
        ? prev.filter((id) => id !== voucherId)
        : [...prev, voucherId]
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[150px]">Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Min Purchase</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                isExpanded={expandedRows.includes(voucher.id)}
                onToggle={() => toggleRow(voucher.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVoucher && isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Voucher</DialogTitle>
              <DialogDescription>Update Voucher</DialogDescription>
            </DialogHeader>
            <VoucherForm
              initialData={selectedVoucher}
              onSuccess={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedVoucher && isDeleteOpen && (
        <DeleteDialogVoucher
          id={selectedVoucher.id}
          kode={selectedVoucher.code}
          onClose={() => setIsDeleteOpen(false)}
          open={isDeleteOpen}
          onOpen={() => setIsDeleteOpen(true)}
        />
      )}
    </>
  );
}
