"use client";

import { HeaderNumber } from "@/components/ui/headernumber";
import { useOrderStore } from "@/hooks/use-order";
import type { PaymentMethod } from "@/types/payment";
import { FormatPrice } from "@/utils/formatPrice";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { useState } from "react";
import { AlertTriangle, Calculator, TrendingUp } from "lucide-react";

// Utility function untuk menghitung tax
function calculateTax(
  price: number,
  method: PaymentMethod
): { taxAmount: number; finalPrice: number } {
  if (!method.taxAdmin) {
    return { taxAmount: 0, finalPrice: price };
  }

  let taxAmount = 0;

  if (method.typeTax === "PERCENTAGE") {
    taxAmount = Math.round((price * method.taxAdmin) / 100);
  } else {
    taxAmount = method.taxAdmin;
  }

  return {
    taxAmount,
    finalPrice: price + taxAmount,
  };
}

// Component untuk menampilkan price preview
function PricePreview({
  originalPrice,
  method,
  isSelected,
}: {
  originalPrice: number;
  method: PaymentMethod;
  isSelected: boolean;
}) {
  const { taxAmount, finalPrice } = calculateTax(originalPrice, method);
  const hasTax = taxAmount > 0;

  if (!hasTax) return null;

  return (
    <div
      className={`mt-2 p-2 rounded-md border transition-all duration-200 ${
        isSelected
          ? "bg-primary/10 border-primary/30"
          : "bg-muted/50 border-border/50"
      }`}
    >
      <div className="flex items-center gap-1 mb-1">
        <Calculator className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Biaya Admin
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Harga Produk:</span>
          <span>{FormatPrice(originalPrice)}</span>
        </div>
        <div className="flex justify-between text-orange-600">
          <span>
            Biaya Admin{" "}
            {method.typeTax === "percentage"
              ? `(${method.taxAdmin}%)`
              : "(Fixed)"}
            :
          </span>
          <span>+{FormatPrice(taxAmount)}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-1 border-border/50">
          <span>Total:</span>
          <span className="text-primary">{FormatPrice(finalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

export function MethodSection() {
  const { data, isLoading, error } = trpc.method.getAll.useQuery({
    isActive: "Active",
    isAll: true,
  });

  const methodData = data?.data ?? [];
  const {
    setMethod,
    method: metode,
    price,
    setFinalPrice,
    productDetails,
    setTax,
  } = useOrderStore();

  // Check if product is selected and price is valid
  const isProductSelected = price > 0 && productDetails.code;
  const shouldShowAlert = !isProductSelected;

  // Group methods by type
  const groupedMethods = methodData.reduce((acc, method: PaymentMethod) => {
    const type = method.tipe as string;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section: string) => {
    if (shouldShowAlert) {
      return; // Don't allow expanding if no product selected
    }
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    if (shouldShowAlert) {
      return; // Don't allow selection if no product selected
    }

    // Check if method minimum is higher than current price
    if (method.min && method.min > price) {
      return; // Don't allow selection if price is below minimum
    }

    // Calculate final price with tax and update store
    const { finalPrice, taxAmount } = calculateTax(price, method);
    setTax(taxAmount);
    setMethod({
      code: method.code,
      name: method.name,
      taxAdmin: method.taxAdmin,
      typeTax: method.typeTax,
      finalPrice: finalPrice, // Store the calculated final price
    });
    setFinalPrice(finalPrice);
  };

  if (isLoading)
    return (
      <div className="text-center py-4 text-foreground">
        Loading payment methods...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-4 text-destructive">
        Error loading payment methods
      </div>
    );

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
      <HeaderNumber number={"3"} title="Metode Pembayaran" />

      {/* Alert when no product selected */}
      {shouldShowAlert && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Pilih Produk Terlebih Dahulu
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Silakan pilih produk di section sebelumnya untuk melanjutkan
                pembayaran
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card p-4 relative">
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs py-1 px-3 rounded-bl-lg font-medium">
          TERBAIK
        </div>
        <div
          className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-colors ${
            shouldShowAlert ? "bg-gray-400/50 opacity-60" : "bg-blue-800/90"
          }`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center mr-3 shadow-md">
              <span className="text-accent text-xl">🪙</span>
            </div>
            <span className="text-card-foreground font-medium">Saldo Akun</span>
          </div>
          <div className="text-chart-5 font-medium">Rp 0</div>
        </div>
      </div>

      <div className="space-y-3 p-3">
        {Object.keys(groupedMethods).map((type, index) => (
          <div
            key={index}
            className={`bg-card border border-border rounded-lg overflow-hidden shadow-md transition-opacity ${
              shouldShowAlert ? "opacity-60" : "opacity-100"
            }`}
          >
            <div
              className={`${
                shouldShowAlert ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => toggleSection(type)}
            >
              <div
                className={`flex justify-between p-4 w-full items-center mb-3 transition-colors ${
                  shouldShowAlert ? "bg-gray-400/50" : "bg-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`capitalize font-medium ${
                      shouldShowAlert
                        ? "text-gray-600"
                        : "text-primary-foreground"
                    }`}
                  >
                    {type}
                  </span>
                  {isProductSelected && (
                    <div className="flex items-center gap-2 bg-blue-900 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium">
                        {FormatPrice(price)}
                      </span>
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm transition-transform duration-300 ${
                    shouldShowAlert ? "text-gray-500" : "text-blue-200"
                  }`}
                  style={{
                    transform: expandedSections[
                      type as keyof typeof expandedSections
                    ]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  ▼
                </span>
              </div>

              <div
                className={`${
                  expandedSections[type as keyof typeof expandedSections]
                    ? "hidden "
                    : "flex"
                } w-full flex-wrap gap-4 p-4 justify-end`}
              >
                {groupedMethods[type].map(
                  (method, idx) =>
                    method.images && (
                      <Image
                        key={idx}
                        src={method.images}
                        alt={method.name}
                        width={50}
                        height={40}
                        className="object-cover"
                      />
                    )
                )}
              </div>
            </div>
            <div
              className={`bg-popover overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections[type as keyof typeof expandedSections]
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                  {groupedMethods[type].map((method, idx) => {
                    const isSelected = metode.code === method.code;
                    const isMethodDisabled =
                      shouldShowAlert || (method.min && method.min > price);
                    const isPriceBelowMinimum =
                      method.min && method.min > price && !shouldShowAlert;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleMethodSelect(method)}
                        className={`p-3 relative w-full rounded-lg flex flex-col transition-all duration-200 border shadow-sm
                            ${
                              isMethodDisabled
                                ? "cursor-not-allowed bg-gray-100 border-gray-200 opacity-50"
                                : isSelected
                                ? "border-primary bg-muted cursor-pointer"
                                : "border-border bg-card hover:bg-muted cursor-pointer hover:shadow-md"
                            }`}
                      >
                        <div className="flex flex-row items-center">
                          <div className="flex-shrink-0 mr-3">
                            <Image
                              src={method.images}
                              alt={method.name}
                              className={`object-cover rounded transition-opacity ${
                                isMethodDisabled ? "opacity-50" : "opacity-100"
                              }`}
                              width={40}
                              height={40}
                            />
                          </div>

                          {isSelected && !isMethodDisabled && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5">
                              ✓
                            </div>
                          )}

                          {isPriceBelowMinimum && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full py-0.5 px-1.5 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Min</span>
                            </div>
                          )}

                          <div className="flex flex-col items-start min-w-0 flex-grow">
                            <span
                              className={`text-sm sm:text-md font-medium truncate w-full ${
                                isMethodDisabled
                                  ? "text-gray-400"
                                  : "text-card-foreground"
                              }`}
                            >
                              {method.name}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-medium truncate w-full ${
                                isMethodDisabled
                                  ? "text-gray-300"
                                  : "text-blue-400"
                              }`}
                            >
                              {method.keterangan}
                            </span>
                          </div>
                        </div>

                        {!isMethodDisabled && isProductSelected && (
                          <PricePreview
                            originalPrice={price}
                            method={method}
                            isSelected={isSelected}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
