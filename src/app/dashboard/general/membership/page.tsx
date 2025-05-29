"use client";
import type React from "react";
import { HeaderGeneral } from "../_components/headerGeneral";
import { Target } from "lucide-react";
import { DialogMembership } from "./_components/dialog";
import { trpc } from "@/utils/trpc";
import { MembershipTable } from "./_components/table";

export default function Page(): React.JSX.Element {
  const { data, isLoading } = trpc.membership.getAll.useQuery();

  return (
    <main className="flex flex-col gap-4 p-10">
      <HeaderGeneral icon={<Target />} text="Membership Setting">
        <DialogMembership />
      </HeaderGeneral>

      <section className="mt-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-muted-foreground">
              Loading...
            </div>
          </div>
        ) : (
          <MembershipTable memberships={data?.data || []} />
        )}
      </section>
    </main>
  );
}
