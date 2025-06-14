import { Clock } from "lucide-react";
export function TimePending({
  hours,
  minutes,
  seconds,
}: {
  hours: string;
  minutes: string;
  seconds: string;
}) {
  return (
    <div className="p-3 bg-blue-900 rounded border border-blue-800 flex items-center justify-between text-white">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Batas Waktu:
      </div>
      <div className="font-mono text-lg font-bold">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
}
