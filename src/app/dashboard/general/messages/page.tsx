"use client";
import { Mail } from "lucide-react";
import { HeaderGeneral } from "../_components/headerGeneral";
import { ButtonCreate } from "./dialogCreate";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";
import { PaginationComponent } from "@/components/ui/pagination-component";
import { MessageWithDetails } from "@/types/messages";
import { TableDataMessage } from "./table";

export default function Page() {
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading } = trpc.messages.getAll.useQuery({
    page,
    limit: 10,
  });
  const dataMessages = (data?.data?.data as MessageWithDetails[]) ?? [];

  if (isLoading) {
    return (
      <main className="p-10">
        <HeaderGeneral icon={<Mail />} text="Messages">
          <ButtonCreate />
        </HeaderGeneral>
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-10">
        <HeaderGeneral icon={<Mail />} text="Messages">
          <ButtonCreate />
        </HeaderGeneral>
        <Alert className="mt-6">
          <AlertDescription>
            Failed to load messages. Please try again later.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="p-10">
      <HeaderGeneral icon={<Mail />} text="Messages">
        <ButtonCreate />
      </HeaderGeneral>

      <div className="mt-6">
        {dataMessages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground text-center">
                Get started by creating your first message.
              </p>
            </CardContent>
          </Card>
        ) : (
          <TableDataMessage messages={dataMessages} />
        )}

        <PaginationComponent
          setCurrentPage={setPage}
          pagination={{
            hasNextPage: data?.data?.meta.hasNext ?? false,
            hasPreviousPage: data?.data?.meta.hasPrev as boolean,
            totalCount: data?.data?.meta.totalCount as number,
            totalPages: data?.data?.meta.totalPages as number,
          }}
          perPage={10}
          currentPage={data?.data?.meta.currentPage as number}
        />
      </div>
    </main>
  );
}
