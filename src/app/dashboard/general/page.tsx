import { Settings } from "lucide-react";
import { Choices, HeaderGeneral } from "./_components/headerGeneral";

export default function Page() {
  return (
    <main className="p-10 flex flex-col gap-5">
      <HeaderGeneral icon={<Settings />} text="Settings" />
      <Choices />
    </main>
  );
}
