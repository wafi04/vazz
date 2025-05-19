"use client";

import { format } from "date-fns";
import {
  CreditCard,
  Wallet,
  Building,
  Clock,
  Check,
  X,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import type { PaymentMethod } from "@/types/payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormatPrice } from "@/utils/formatPrice";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DetailsMethodProps {
  data: PaymentMethod | null;
  onClose: () => void;
  open: boolean;
}

export function DetailsMethod({ data, onClose, open }: DetailsMethodProps) {
  if (!data) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "virtual-account":
        return <Building className="h-5 w-5" />;
      case "e-walet":
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-muted">
              <AvatarImage src={data.images} alt={data.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {data.code?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl">{data.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getPaymentTypeIcon(data.tipe)}
                <span className="capitalize">
                  {data.tipe?.replace("-", " ")}
                </span>
                <Badge
                  variant={data.isActive ? "default" : "secondary"}
                  className="ml-1"
                >
                  {data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="limits">Limits & Fees</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="m-0">
            <div className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Code
                      </span>
                      <span className="font-medium">{data.code}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Name
                      </span>
                      <span className="font-medium">{data.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <div className="flex items-center gap-1.5">
                        {data.isActive ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>{data.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Type
                      </span>
                      <div className="flex items-center gap-1.5">
                        {getPaymentTypeIcon(data.tipe)}
                        <span className="capitalize">
                          {data.tipe?.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Settings
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Min Expiry
                      </span>
                      <span className="font-medium">
                        {data.minExpired} hours
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Max Expiry
                      </span>
                      <span className="font-medium">
                        {data.maxExpired} hours
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                      <span className="text-sm">
                        {formatDate(data.createdAt as string)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Updated
                      </span>
                      <span className="text-sm">
                        {formatDate(data.updatedAt as string)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm text-muted-foreground">
                        Keterangan
                      </h3>
                      <p className="text-sm">
                        {data.keterangan ||
                          "No description available for this payment method."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="limits" className="m-0">
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount Limits */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount Limits
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Minimum Amount
                      </span>
                      <span className="font-medium">
                        {FormatPrice(data.min ?? 0)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Maximum Amount
                      </span>
                      <span className="font-medium">
                        {FormatPrice(data.max ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fee Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Fee Information
                  </h3>

                  <div className="space-y-3">
                    {data.taxAdmin !== undefined ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Fee Amount
                          </span>
                          <span className="font-medium">
                            {FormatPrice(data.taxAdmin ?? 0)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Fee Type
                          </span>
                          <Badge variant="outline">
                            {data.typeTax === "PERCENTAGE"
                              ? "Percentage"
                              : "Fixed"}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="bg-muted/40 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          No fee information available for this payment method.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between  bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">
            Payment Method ID: {data.id}
          </p>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
