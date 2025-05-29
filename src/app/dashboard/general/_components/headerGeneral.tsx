"use client";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const data = [
  {
    name: "Messages",
    link: "messages",
  },
  {
    name: "Membership",
    link: "membership",
  },
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
    <>
      <section className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {icon}
          {text}
        </h1>
        {children}
      </section>
    </>
  );
}

export function Choices() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Choice link={item.link} name={item.name} key={item.name} />
      ))}
    </section>
  );
}

export function Choice({ name, link }: { name: string; link: string }) {
  const { push } = useRouter();
  const pathname = usePathname();
  return <Button onClick={() => push(`${pathname}/${link}`)}>{name}</Button>;
}
