"use client";
import {
  CheckCircle,
  Smartphone,
  CreditCard,
  Phone,
  Loader2,
} from "lucide-react";

interface AccountInfoSectionProps {
  userId: string | undefined;
  zone: string | undefined;
  method:
    | {
        name: string;
        code?: string;
      }
    | undefined;
  whatsAppNumber: string | undefined;
  voucherCode: string | undefined;
  requiresValidation: boolean;
  isCheckingNickname: boolean;
  nicknameData: string | null;
}

export const AccountInfoSection = ({
  userId,
  zone,
  method,
  whatsAppNumber,
  voucherCode,
  requiresValidation,
  isCheckingNickname,
  nicknameData,
}: AccountInfoSectionProps) => {
  return (
    <div className="px-4 py-2 space-y-2">
      <h3 className="text-xs font-medium text-indigo-200 mb-1.5 flex items-center">
        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-1.5"></span>
        Account Information
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {/* User ID */}
        <div className="bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
          <div className="flex flex-col">
            <span className="text-xs text-indigo-300">User ID</span>
            <span className="text-xs font-medium text-white">
              {userId || "-"}
            </span>
          </div>
        </div>

        {/* Zone ID (if applicable) */}
        {zone && (
          <div className="bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
            <div className="flex flex-col">
              <span className="text-xs text-indigo-300">Zone ID</span>
              <span className="text-xs font-medium text-white">
                {zone || "-"}
              </span>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
          <div className="flex flex-col">
            <span className="text-xs text-indigo-300">Payment Method</span>
            <span className="text-xs font-medium text-white">
              {method?.name || "-"}
            </span>
          </div>
        </div>

        <div className="bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
          <div className="flex flex-col">
            <span className="text-xs text-indigo-300">WhatsApp</span>
            <span className="text-xs font-medium text-white">
              {whatsAppNumber ?? "Belum Diisi"}
            </span>
          </div>
        </div>

        {/* Nickname Validation */}
        {requiresValidation && (
          <div className="bg-indigo-950/50 p-2 rounded border border-indigo-500/20 col-span-2">
            <div className="flex flex-col">
              <span className="text-xs text-indigo-300">Nickname</span>
              {isCheckingNickname ? (
                <span className="text-xs text-indigo-200">Checking...</span>
              ) : (
                <span className="text-xs font-medium text-white">
                  {nicknameData || "-"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
