"use client";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getStatusBadge } from "@/utils/getStatusActive";
import { FormatPrice, formatDate } from "@/utils/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PembelianManualData } from "@/types/transaction";
import { EmptyState } from "@/components/ui/not-found/NotFound";

const OrderTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]"></TableHead>
      <TableHead>Produk</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Tanggal</TableHead>
      <TableHead>Harga</TableHead>
      <TableHead>Order ID</TableHead>
      <TableHead>User ID</TableHead>
      <TableHead>Nickname</TableHead>
      <TableHead>Zone</TableHead>
      <TableHead>Dibuat Oleh</TableHead>
      <TableHead>WhatsApp</TableHead>
      <TableHead>Alasan</TableHead>
    </TableRow>
  </TableHeader>
);

// Expanded Row Component
const ExpandedOrderRow = ({ order }: { order: PembelianManualData }) => {
  return (
    <TableRow className="bg-gradient-to-r from-card to-muted/20">
      <TableCell colSpan={12}>
        <div className="p-4 border border-border/30 rounded-lg space-y-4">
          {/* Manual Order Details */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-wide">
                DETAIL PESANAN MANUAL
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <OrderDetail label="Manual ID" value={order.pembelianManualId} />
              <OrderDetail label="Status" value={order.status} />
              <OrderDetail label="User ID" value={order.userId} />
              <OrderDetail label="Nickname" value={order.nickname || "-"} />
              <OrderDetail label="Zone/Server" value={order.zone || "-"} />
              <OrderDetail label="WhatsApp" value={order.whatsapp || "-"} />
              <OrderDetail label="Dibuat Oleh" value={order.createdBy || "-"} />
              <OrderDetail
                label="Tanggal"
                value={formatDate(order.createdAt)}
              />
            </div>

            {/* Pricing Information */}
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Harga:</span>
                  <span className="text-sm font-bold text-green-600">
                    {FormatPrice(order.harga)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Profit %:
                  </span>
                  <span className="text-sm font-bold text-chart-2">
                    {order.profit}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Profit Rupiah:
                  </span>
                  <span className="text-sm font-bold text-chart-2">
                    {FormatPrice(order.profitRupiah)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reason if exists */}
            {order.reason && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="bg-accent/10 px-3 py-2 rounded-lg border border-accent/20">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Alasan:
                  </span>
                  <span className="text-sm text-foreground">
                    {order.reason}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Original Order Details (if exists) */}
          {order.pembelian && (
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <p className="text-xs text-primary font-bold uppercase tracking-wide">
                  PESANAN ASLI (REFERENSI)
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <OrderDetail
                  label="Original ID"
                  value={order.pembelian.orderId}
                />
                <OrderDetail label="Status" value={order.pembelian.status} />
                <OrderDetail
                  label="Provider ID"
                  value={order.pembelian.providerOrderId ?? "-"}
                />
                <OrderDetail
                  label="Tipe"
                  value={order.pembelian.tipeTransaksi}
                />
              </div>

              {/* Original Order Pricing */}
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Harga Asli:
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {FormatPrice(order.pembelian.harga)}
                    </span>
                  </div>
                  {order.pembelian.profit && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Profit % Asli:
                        </span>
                        <span className="text-sm font-bold text-chart-2">
                          {order.pembelian.profit}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Profit Rupiah Asli:
                        </span>
                        <span className="text-sm font-bold text-chart-2">
                          {FormatPrice(order.pembelian.profitRupiah || 0)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Connection Info */}
          {order.orderId && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <span className="text-xs text-yellow-700 dark:text-yellow-300 block mb-1">
                  Tipe Pesanan:
                </span>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Reorder dari pesanan #{order.orderId}
                </span>
              </div>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

// Order Detail Component
const OrderDetail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-xs text-muted-foreground">{label}:</span>
    <p className="font-mono text-sm text-foreground">{value}</p>
  </div>
);

// Main Order Row Component
const OrderRow = ({
  order,
  isExpanded,
  onToggle,
}: {
  order: PembelianManualData;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <TableRow
    className="hover:bg-muted/20 transition-all duration-200 cursor-pointer"
    onClick={onToggle}
  >
    <TableCell>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary" />
        )}
      </button>
    </TableCell>

    <TableCell className="font-semibold text-foreground hover:text-primary transition-colors">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <span>{order.productName}</span>
      </div>
    </TableCell>

    <TableCell>{getStatusBadge(order.status)}</TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {formatDate(order.createdAt)}
    </TableCell>
    <TableCell className="font-bold text-primary text-lg">
      {order.harga && FormatPrice(order.harga ?? 0)}
    </TableCell>
    <TableCell className="font-mono text-sm font-semibold">
      {order.pembelianManualId}
    </TableCell>
    <TableCell className="font-semibold">{order.userId}</TableCell>
    <TableCell className="font-semibold">{order.nickname}</TableCell>
    <TableCell className="font-semibold">{order.zone}</TableCell>

    <TableCell className="flex items-center space-x-2">
      <span className="font-medium text-foreground">{order.createdBy}</span>
    </TableCell>

    <TableCell>
      {order.whatsapp ? (
        <span className="font-medium text-foreground">{order.whatsapp}</span>
      ) : (
        "-"
      )}
    </TableCell>

    <TableCell>
      {order.reason ? (
        <div className="text-sm bg-accent/10 px-3 py-1 rounded-lg border border-accent/20">
          <span className="text-accent font-medium">Alasan:</span>
          <span className="text-foreground ml-2">{order.reason}</span>
        </div>
      ) : (
        "-"
      )}
    </TableCell>
  </TableRow>
);

// Orders Table Component
export const OrdersTable = ({
  orders,
  expandedRows,
  onToggleRow,
}: {
  orders: PembelianManualData[];
  expandedRows: string[];
  onToggleRow: (orderId: string) => void;
}) => {
  if (!orders || orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <Table>
      <OrderTableHeader />
      <TableBody>
        {orders.map((order) => {
          const orderId = order.id.toString();
          const isExpanded = expandedRows.includes(orderId);

          return (
            <React.Fragment key={order.id}>
              <OrderRow
                order={order}
                isExpanded={isExpanded}
                onToggle={() => onToggleRow(orderId)}
              />
              {isExpanded && <ExpandedOrderRow order={order} />}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};
