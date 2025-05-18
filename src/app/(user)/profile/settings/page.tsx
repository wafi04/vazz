"use client";

import { User, UserProfile } from "@/types/schema/user";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { trpc } from "@/utils/trpc";
import { SettingsProfile } from "./form-update-user";
import { SettingsLayout } from "@/components/layouts/settings-layout";

export default function SettingsPage() {
  const { data } = trpc.member.findMe.useQuery();
  if (!data) return <LoadingOverlay />;
  return (
    <SettingsLayout>
      <SettingsProfile user={data.data as UserProfile} />
    </SettingsLayout>
  );
}
