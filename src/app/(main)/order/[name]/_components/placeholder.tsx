"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XCircle, Loader2 } from "lucide-react";
import type { Category } from "@/types/category";
import { CheckNickName } from "@/lib/check-nickname";
import { GAMES_WITH_VALIDATION, GameType } from "@/data/check-code";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useOrderStore } from "@/hooks/use-order";

interface ServerOption {
  name: string;
  value: string;
}

type ServerData = string[] | ServerOption[];

interface PlaceholderContentType {
  userId?: string;
  serverId?: string;
  onChangeUserId?: (value: string) => void;
  onChangeServerId?: (value: string) => void;
  category: Category;
  serverData?: ServerData;
}

export interface NicknameResult {
  success: boolean;
  game?: string;
  id?: number;
  server?: number;
  region?: string;
  name?: string;
  message?: string;
}

export function PlaceholderContent({
  category,
  onChangeServerId,
  onChangeUserId,
  serverId = "",
  userId = "",
  serverData,
}: PlaceholderContentType) {
  const { name } = useParams();
  const [dataNickname, setNickname] = useState<NicknameResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setNickName, nickname, setCheck } = useOrderStore();

  const hasSecondInput =
    category.placeholder2 &&
    category.placeholder2 !== "-" &&
    category.placeholder2 !== "." &&
    category.placeholder2 !== "2" &&
    category.placeholder2 != "h";

  const shouldUseDropdown =
    hasSecondInput && serverData && serverData.length > 0;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeUserId) {
      onChangeUserId(e.target.value);
    }
    if (dataNickname) {
      setNickname(null);
    }
    if (nickname) {
      setNickName(undefined);
    }
  };

  const handleServerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeServerId) {
      onChangeServerId(e.target.value);
    }
    if (dataNickname) {
      setNickname(null);
    }
    if (nickname) {
      setNickName(undefined);
    }
  };

  const handleServerSelectChange = (value: string) => {
    if (onChangeServerId) {
      onChangeServerId(value);
    }
    if (dataNickname) {
      setNickname(null);
    }
    if (nickname) {
      setNickName(undefined);
    }
  };

  const checkingUsername = async () => {
    if (category.kode && userId && category.isChecknickname) {
      setIsLoading(true);
      setCheck({ isChecking: true, withoutCheking: false }); // Start checking
      try {
        const data = await CheckNickName({
          type: category.kode as GameType,
          userId: userId,
          serverId,
        });
        setNickName(data.name || data.message || "Username validated");
        setNickname(data);
      } catch (error: any) {
        setNickName(undefined);
        setNickname({
          success: false,
          message: error.message || "Unable to validate nickname",
        });
      } finally {
        setIsLoading(false);
        setCheck({ isChecking: false, withoutCheking: false }); // Done checking
      }
    }
  };

  React.useEffect(() => {
    if (
      category.isChecknickname &&
      userId &&
      (hasSecondInput ? serverId : true) &&
      category.kode
    ) {
      const timeoutId = setTimeout(() => {
        checkingUsername();
      }, 1500);

      return () => clearTimeout(timeoutId);
    } else if (!category.isChecknickname) {
      setCheck({ isChecking: false, withoutCheking: true });
      setNickName(undefined);
      setNickname(null);
    }
  }, [userId, serverId, category.kode, category.isChecknickname]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row justify-between space-y-4 p-4 md:space-y-0 gap-2">
        <div className="flex flex-col space-y-2 w-full">
          <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            {category.placeholder1}
          </Label>
          <Input
            value={userId ?? ""}
            onChange={handleUserIdChange}
            placeholder={`${category.placeholder1}`}
            className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
          />
        </div>

        {hasSecondInput && (
          <div className="flex flex-col space-y-2 w-full">
            <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
              {category.placeholder2}
            </Label>

            {shouldUseDropdown ? (
              <Select value={serverId} onValueChange={handleServerSelectChange}>
                <SelectTrigger className="w-full rounded-lg px-2 py-1 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900">
                  <SelectValue placeholder={`Pilih ${category.placeholder2}`} />
                </SelectTrigger>
                <SelectContent className="bg-[#0a192f] border-blue-700">
                  {serverData.map((server, index) => {
                    const value =
                      typeof server === "string" ? server : server.value;
                    const Label =
                      typeof server === "string" ? server : server.name;

                    return (
                      <SelectItem
                        key={index}
                        value={value}
                        className="text-white hover:bg-blue-800"
                      >
                        {Label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={serverId ?? ""}
                onChange={handleServerIdChange}
                placeholder={`${category.placeholder2}`}
                className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
              />
            )}
          </div>
        )}
      </div>

      {/* Nickname Result Display - Only show for games that require validation */}
      {category.isChecknickname && (isLoading || dataNickname) && (
        <div className="px-4 pb-4">
          <div className="bg-card rounded-2xl py-2 px-4">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-gray-300">Checking nickname...</span>
              </div>
            ) : dataNickname?.success ? (
              <div className="text-sm">
                <span className="text-gray-400">Your account is </span>
                <span className="font-bold text-green-300">
                  {dataNickname.name}
                </span>
                {dataNickname.region && (
                  <>
                    <span className="text-gray-400"> from </span>
                    <span className="text-green-300">
                      {dataNickname.region}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm flex gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-400 font-medium">
                  Account tidak ditemukan
                </span>
                <span className="text-red-100 text-sm">
                  {dataNickname?.message ||
                    "Tolong Check User ID and Server ID"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
