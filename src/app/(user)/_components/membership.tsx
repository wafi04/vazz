import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FormatPrice } from "@/utils/formatPrice";

export function MembershipContent() {
  const [selectedPlan, setSelectedPlan] = useState("Basic");

  const MEMBERSHIP_PLANS = [
    {
      name: "Basic",
      price: 50000,
      features: ["Akses Game Dasar", "Support 24/7", "Bonus 5% setiap top-up"],
    },
    {
      name: "Premium",
      price: 100000,
      features: [
        "Akses Semua Game",
        "Support 24/7",
        "Bonus 10% setiap top-up",
        "Prioritas Transaksi",
      ],
    },
    {
      name: "VIP",
      price: 200000,
      features: [
        "Akses Semua Game",
        "Support 24/7",
        "Bonus 15% setiap top-up",
        "Prioritas Transaksi",
        "Cashback 5%",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {MEMBERSHIP_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-lg border p-4 cursor-pointer transition-colors",
              selectedPlan === plan.name
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            )}
            onClick={() => setSelectedPlan(plan.name)}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold cursor-pointer">
                  {plan.name}
                </Label>
                {selectedPlan === plan.name && (
                  <Badge variant="default" className="ml-2">
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-xl font-bold text-primary">
                {FormatPrice(plan.price)}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {plan.features.slice(0, 2).map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full">Beli Membership</Button>
    </div>
  );
}
