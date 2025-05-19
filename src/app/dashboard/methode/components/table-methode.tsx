"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  CreditCard,
  Wallet,
  Building,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import type { PaymentMethod } from "@/types/payment";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogMethod } from "./dialog-methode";
import { FormatPrice } from "@/utils/formatPrice";
import { DetailsMethod } from "./detailsMethod";

interface TableMethodeProps {
  data: PaymentMethod[];
}

export default function TableMethode({ data }: TableMethodeProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [open,setOpen]  = useState<boolean>(false)

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "virtual-account":
        return <Building className="h-4 w-4 mr-1" />;
      case "e-walet":
        return <Wallet className="h-4 w-4 mr-1" />;
      default:
        return <CreditCard className="h-4 w-4 mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleDelete = (id: number) => {
    console.log(`Delete payment method with ID: ${id}`);
  };

  const handleViewDetails = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setOpen(true)
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your available payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Code</TableHead>
                  <TableHead className="min-w-[180px]">Method</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Min Amount
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Expiry (hrs)
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">
                        {method.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={method.images}
                              alt={method.name}
                            />
                            <AvatarFallback>{method.code}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">
                              Updated {formatDate(method.updatedAt as string)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          {getPaymentTypeIcon(method.tipe)}
                          <span className="capitalize">
                            {method.tipe.replace("-", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {FormatPrice(method.min ?? 0)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {method.minExpired === method.maxExpired
                          ? method.minExpired
                          : `${method.minExpired} - ${method.maxExpired}`}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge>{method.isActive ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewDetails(method)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DialogMethod data={method}>
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogMethod>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Are you sure?
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(method.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem>Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedMethod && (
        <DetailsMethod
          open={open}
          onClose={() => {
            setSelectedMethod(null)
            setOpen(true)
          }}
          data={selectedMethod}
        />
      )}
    </>
  );
}
