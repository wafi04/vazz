import { FilterProduct } from "@/hooks/use-filterGame"
import { CreditCard, Gamepad2, Smartphone, Zap } from "lucide-react"

export const filterOptions: {
    value: FilterProduct
    label: string
    icon: React.ReactNode
    gradient: string
  }[] = [
    {
      value: "gamelainnya",
      label: "Game",
      icon: <Gamepad2 size={18} />,
      gradient: "from-violet-600 to-indigo-600",
    },
    {
      value: "voucher",
      label: "Voucher",
      icon: <CreditCard size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      value: "pulsa",
      label: "Pulsa",
      icon: <Smartphone size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      value: "pln",
      label: "PLN",
      icon: <Zap size={18} />,
      gradient: "from-rose-500 to-pink-600",
    },
  ]