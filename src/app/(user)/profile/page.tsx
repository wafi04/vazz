"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardProfile from "../_components/CardProfile";
import { FormatPrice } from "@/utils/formatPrice";
import { trpc } from "@/utils/trpc";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormTopupContent } from "../_components/form-topup";
import { MembershipContent } from "../_components/membership";
import { TableProfileTopup } from "../_components/table/table-profile-topup";
import { TableDeposit } from "../_components/table/table-deposit";
import { TableMembership } from "../_components/table/table-memberhisp";
import { PaginationComponent } from "@/components/ui/pagination-component";

export default function ProfilePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this dynamic if needed
  const [activeTab, setActiveTab] = useState("deposit");

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.member.findMe.useQuery({
    limit: itemsPerPage,
    page: currentPage,
  });

  useEffect(() => {
    if (!isLoading && (!userResponse || !userResponse.data)) {
      redirect("/");
    }
  }, [userResponse, isLoading]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Refetch data when page changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-destructive">
            Error: {error?.message || "Failed to load profile"}
          </p>
        </div>
      </main>
    );
  }

  const user = userResponse?.data;
  const pagination = user?.pagination;
  console.log(pagination);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
        {/* Profile Card - Spans 1 column */}
        <CardProfile user={user} />

        {/* Balance Card - Spans 3 columns */}
        <Card className="md:col-span-3 p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {FormatPrice(user?.balance ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Available Balance
                </p>
              </div>
              <Button
                onClick={() => router.push("/profile/settings")}
                className="h-9 px-4 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors rounded-md"
              >
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Deposit, Membership, and Transaction History - Spans 4 columns */}
        <div className="md:col-span-4">
          <Tabs
            defaultValue="deposit"
            className="w-full"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              // Reset pagination when switching tabs
              if (value === "history") {
                setCurrentPage(1);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            {/* Deposit Tab */}
            <TabsContent value="deposit">
              <div className="flex flex-col w-full md:flex-row gap-6">
                <Card className="w-full md:max-w-[50%] max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <CardHeader>
                    <CardTitle>Deposit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormTopupContent />
                  </CardContent>
                </Card>
                <Card className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <CardHeader>
                    <CardTitle>Riwayat Deposit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableDeposit />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership">
              <div className="flex flex-col w-full md:flex-row gap-6">
                <Card className="w-full md:max-w-[50%] max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <CardHeader>
                    <CardTitle>Pilih Membership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MembershipContent />
                  </CardContent>
                </Card>
                <Card className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <CardHeader>
                    <CardTitle>Riwayat Membership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableMembership />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableProfileTopup purchases={user?.pembelian as any[]} />
                </CardContent>
                <CardFooter className="flex items-center pt-6 w-full">
                  {pagination && (
                    <PaginationComponent
                      currentPage={currentPage}
                      pagination={{
                        hasNextPage: user.pagination.hasNextPage,
                        hasPreviousPage: user.pagination.hasPrevPage,
                        totalCount: user.pagination.totalItems,
                        totalPages: user.pagination.totalPages,
                      }}
                      perPage={10}
                      setCurrentPage={() => handlePageChange(currentPage)}
                    />
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
