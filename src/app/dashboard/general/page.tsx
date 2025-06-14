import { Settings } from "lucide-react";
import { HeaderGeneral } from "./_components/headerGeneral";
import { Choices } from "./_components/headerGeneral";

export default function Page() {
  return (
    <main className="min-h-screen md:p-10 max-w-7xl mx-auto space-y-4">
      <HeaderGeneral
        icon={<Settings className="animate-spin-slow text-blue-500" />}
        text="Settings"
      />

      <Choices />
    </main>
  );
}
