import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormatPrice, formatDate } from "@/utils/formatPrice";
import { useLogicTransaksi } from "./utils";
import { Transaksi } from "@/types/pembayaran";
import { TimePending } from "./_components/time";
import { QrCodeMethod } from "./_components/qrCode";
import { VirtualAccount } from "./_components/virtualAccount";
import { DetailItem } from "./_components/itemDetails";
import { Badge } from "./_components/badge";

interface TransactionDetailsProps {
  data: Transaksi;
}

export function TransactionDetails({ data }: TransactionDetailsProps) {
  const { copy, url, copied, timeLeft, paymentType } = useLogicTransaksi({
    data,
  });

  const isPending = data.pembayaran?.status === "PENDING";
  const timeLeftParts = timeLeft
    ? timeLeft.split(":").map((part) => part.trim())
    : ["00", "00", "00"];
  const [hours, minutes, seconds] =
    timeLeftParts.length === 3 ? timeLeftParts : ["00", ...timeLeftParts];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kartu Informasi Pembelian */}
        <Card className="shadow-md border-0 overflow-hidden rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Informasi Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detail Layanan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-md font-medium text-muted-foreground mb-3">
                Detail Layanan
              </h3>
              <div className="space-y-3">
                <DetailItem label="Pembelian " value={data.layanan} />
                <DetailItem
                  label="Tipe Transaksi"
                  value={data.tipeTransaksi}
                  valueClassName="text-md"
                />
                <DetailItem
                  label="Status Pemesanan"
                  value={<Badge status={data.status} />}
                  valueClassName="text-md"
                />
              </div>
            </motion.div>

            {/* Informasi Pengguna */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Detail Pengguna
              </h3>
              <div className="space-y-3">
                {data.username && (
                  <DetailItem
                    label="Username"
                    value={data.username}
                    valueClassName="text-lg"
                  />
                )}
                {data.nickname && (
                  <DetailItem label="Nickname" value={data.nickname || "-"} />
                )}
                {data.userId && (
                  <DetailItem label="User Id" value={data.userId} />
                )}
                {data.zone && <DetailItem label="Zone" value={data.zone} />}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Kartu Informasi Pembayaran */}
        {data.pembayaran && (
          <Card className="shadow-md border-0 overflow-hidden rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer untuk pembayaran pending */}
              {isPending && (
                <TimePending
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                />
              )}

              {/* Detail Pembayaran */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Detail Pembayaran
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Metode" value={data.pembayaran.metode} />

                  {/* QRIS Code Display */}
                  {paymentType === "QRIS" &&
                    data.pembayaran.noPembayaran &&
                    isPending && (
                      <QrCodeMethod
                        noPembayaran={data.pembayaran.noPembayaran}
                      />
                    )}

                  {/* Virtual Account */}
                  {paymentType === "VA" && data.pembayaran.noPembayaran && (
                    <VirtualAccount
                      copied={copied}
                      copy={copy}
                      noPembayaran={data.pembayaran.noPembayaran}
                    />
                  )}

                  {/* Payment URL */}
                  {paymentType === "URL" &&
                    data.pembayaran.noPembayaran &&
                    isPending && (
                      <div className="mt-2 mb-3">
                        <div className="text-sm text-muted-foreground mb-1">
                          Link Pembayaran:
                        </div>
                        <Button
                          variant="outline"
                          onClick={url}
                          className="w-full justify-center text-sm py-2 h-10 gap-2 bg-blue-800 text-white hover:bg-blue-900"
                        >
                          Buka Link Pembayaran
                        </Button>
                      </div>
                    )}

                  <DetailItem
                    label="Status"
                    value={<Badge status={data.pembayaran.status} />}
                  />
                  <DetailItem
                    label="Waktu"
                    value={formatDate(data.pembayaran.createdAt as string)}
                  />
                  <DetailItem
                    label="No. Pembeli"
                    value={`${data.pembayaran.noPembeli}`}
                    valueClassName=""
                  />
                  <DetailItem
                    label="Harga"
                    value={FormatPrice(parseInt(data.pembayaran?.harga))}
                    valueClassName="font-semibold text-primary"
                  />
                  {data.pembayaran.feeRupiah &&
                    data.pembayaran.feeRupiah > 0 && (
                      <DetailItem
                        label="Pajak"
                        value={FormatPrice(
                          data.pembayaran?.feeRupiah as number
                        )}
                        valueClassName="font-semibold text-primary"
                      />
                    )}
                  <DetailItem
                    label="Total"
                    value={FormatPrice(data.pembayaran?.totalAmount as number)}
                    valueClassName="font-semibold text-primary"
                  />
                  {data.sn && (
                    <DetailItem
                      label="Sn"
                      value={`${data.sn}`}
                      valueClassName=""
                    />
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
