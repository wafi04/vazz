import { HeaderNumber } from "@/components/ui/headernumber";
import { useOrderStore } from "@/hooks/user-order";
import { PaymentMethod } from "@/types/payment";
import { FormatPrice } from "@/utils/formatPrice";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { useState } from "react";

export function MethodSection() {
  const { data, isLoading ,error} = trpc.method.getAll.useQuery({
    isActive: true,
    isAll: true
  });
  
  const methodData = data?.data ?? [];
  const {setMethod,method : metode}  = useOrderStore()
 
  // Group methods by type
  const groupedMethods = methodData.reduce((acc, method: PaymentMethod) => {
    const type = method.tipe as string;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);
  
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) return <div className="text-center py-4 text-foreground">Loading payment methods...</div>;
  if (error) return <div className="text-center py-4 text-destructive">Error loading payment methods</div>;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
                <HeaderNumber number={"3"} title="Metode Pembayaran" />
          
      <div className="bg-card p-4 relative ">
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs py-1 px-3 rounded-bl-lg font-medium">
          TERBAIK
        </div>
        <div className="flex justify-between  items-center bg-blue-800/90 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center mr-3 shadow-md">
              <span className="text-accent text-xl">🪙</span>
            </div>
            <span className="text-card-foreground font-medium">Saldo Akun</span>
          </div>
          <div className="text-chart-5 font-medium">
            Rp 0
          </div>
        </div>
      </div>
      
      <div className="space-y-3 p-3">
        {Object.keys(groupedMethods).map((type, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection(type)}
            >
              <div className="flex bg-primary justify-between p-4 w-full items-center mb-3">
                <span className="text-primary-foreground capitalize font-medium">{type}</span>
                <span className="text-blue-200 text-sm transition-transform duration-300" 
                  style={{ transform: expandedSections[type as keyof typeof expandedSections] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>
            
                    <div className={`${expandedSections[type as keyof typeof expandedSections] ? "hidden " : "flex"} w-full flex-wrap gap-4 p-4 justify-end`}>
                {(
                  groupedMethods[type].map((method, idx) => (
                    method.images && (
                      <Image
                        key={idx}
                        src={method.images}
                        alt={method.name}
                        width={50}
                        height={40}
                        className="object-cover "
                      />
                    )
                  ))
                )}
              </div>
            </div>

            <div 
              className={`bg-popover  overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections[type as keyof typeof expandedSections] 
                  ? 'max-h-screen opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-3">
                <div className="grid grid-cols-2 w-full gap-3">
                 {groupedMethods[type].map((method, idx) => {
  const isSelected = metode.code === method.code
  return (
    <div 
      key={idx} 
      onClick={() => setMethod({
        code : method.code,
        name : method.name
      })}
      className={`p-3 relative w-full rounded-lg flex flex-row items-center transition-colors cursor-pointer border shadow-sm gap-6
        ${isSelected ? 'border-primary bg-muted' : 'border-border bg-card hover:bg-muted'}`}
    >
      {/* <div className="relati"> */}
        <Image
          src={method.images} 
          alt={method.name} 
          className="object-cover rounded"
          width={50}
          height={50}
        />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5">
            ✓
          </div>
        )}
      
      <div className="flex flex-col items-start">
        <span className="text-card-foreground text-md font-medium">{method.name}</span>
        <span className="text-blue-400 text-sm font-medium">{method.keterangan}</span>
        {method.min && (
          <span className="text-xs text-muted-foreground mt-1">
            Min: {FormatPrice(method.min)}
          </span>
        )}
      </div>
    </div>
  );
})}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}