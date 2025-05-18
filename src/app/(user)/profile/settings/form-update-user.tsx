"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppInput } from "@/components/ui/wa-input";
import type { User } from "@/types/schema/user";
import type React from "react";
import { useState } from "react";

export function SettingsProfile({ user }: { user: User }) {
  const [formData, setFormData] = useState({
    name: user.name ?? "",
    whatsapp: user.whatsapp ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Profil
        </h1>
        <p className="text-blue-200">
          Kelola informasi profil dan pengaturan akun Anda.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-blue-900 bg-[#00184a] p-6 shadow-xl"
        >
          <div className="mb-6 border-b border-blue-900 pb-4">
            <h3 className="text-lg font-medium text-white">Informasi Dasar</h3>
            <p className="text-sm text-blue-200 mt-1">
              Perbarui informasi profil Anda.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-blue-100"
                >
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-900 bg-[#002966] px-4 py-2 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-blue-300/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-sm font-medium text-blue-100"
                >
                  WhatsApp
                </Label>
                <WhatsAppInput
                  type="text"
                  placeholder="81234567890"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-900 bg-[#002966] px-4 py-2 text-white shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-blue-300/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#001435]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
