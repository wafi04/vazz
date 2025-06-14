"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  MessageSquare,
  Crown,
  Image,
  Users,
  Activity,
  Shield,
  Zap,
  Bell,
  Palette,
  Globe,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const data = [
  {
    name: "Messages",
    link: "messages",
    icon: MessageSquare,
    description: "Manage your chat settings and preferences",
    color: "from-blue-500 to-cyan-500",
    badge: "New",
  },
  {
    name: "Membership",
    link: "membership",
    icon: Crown,
    description: "Upgrade your account and billing settings",
    color: "from-purple-500 to-pink-500",
    badge: "Pro",
  },
  {
    name: "Banner",
    link: "banner",
    icon: Image,
    description: "Customize your profile banner and appearance",
    color: "from-green-500 to-emerald-500",
    badge: null,
  },
];

const quickActionsData = [
  { name: "Notifications", icon: Bell, color: "from-orange-500 to-red-500" },
  { name: "Theme", icon: Palette, color: "from-indigo-500 to-purple-500" },
  { name: "Language", icon: Globe, color: "from-teal-500 to-green-500" },
  { name: "Security", icon: Shield, color: "from-red-500 to-pink-500" },
];

const statsData = [
  {
    label: "Active Sessions",
    value: "3",
    icon: Activity,
    color: "text-green-600",
  },
  { label: "Total Users", value: "1.2K", icon: Users, color: "text-blue-600" },
  { label: "Storage Used", value: "67%", icon: Zap, color: "text-purple-600" },
];

export function HeaderGeneral({
  text,
  icon,
  children,
}: {
  text: string;
  icon: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="flex justify-between items-center w-full">
      <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        {icon}
        {text}
      </h1>
      {children}
    </section>
  );
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActionsData.map((action, index) => (
          <button
            key={action.name}
            className="group relative overflow-hidden rounded-lg p-4 bg-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 border border-white/30"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <action.icon
                className={`w-6 h-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
              />
              <span className="text-sm font-medium text-slate-700">
                {action.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Choices() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data.map((item, index) => (
        <Choice
          key={item.name}
          link={item.link}
          name={item.name}
          icon={item.icon}
          description={item.description}
          color={item.color}
          badge={item.badge}
          index={index}
          isHovered={hoveredCard === item.name}
          onHover={setHoveredCard}
        />
      ))}
    </section>
  );
}

export function Choice({
  name,
  link,
  icon: Icon,
  description,
  color,
  badge,
  index,
  isHovered,
  onHover,
}: {
  name: string;
  link: string;
  icon: any;
  description: string;
  color: string;
  badge: string | null;
  index: number;
  isHovered: boolean;
  onHover: (name: string | null) => void;
}) {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-sm shadow-xl border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] cursor-pointer animate-in fade-in slide-in-from-bottom-4"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "both",
      }}
      onClick={() => push(`${pathname}/${link}`)}
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-all duration-500`}
      />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-xl" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div
          className="absolute bottom-6 left-6 w-1 h-1 bg-accent rounded-full animate-ping"
          style={{ animationDelay: "200ms" }}
        />
        <div
          className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-secondary rounded-full animate-ping"
          style={{ animationDelay: "400ms" }}
        />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-white/20`}
          >
            <Icon className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          {badge && (
            <Badge
              variant="secondary"
              className="bg-muted/50 text-muted-foreground font-medium border border-border/50 shadow-sm"
            >
              {badge}
            </Badge>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
            {name}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
