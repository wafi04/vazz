import { motion } from "framer-motion";
import { DigiflazzOption } from "./digiflazz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const OptionCard: React.FC<{
  option: DigiflazzOption;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ option, index, isSelected, onClick }) => {
  const Icon = option.icon;

  return (
    <motion.div
      key={index}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer shadow-md hover:shadow-xl transition-all 
            border-2 ${
              isSelected
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-primary/70"
            } 
            bg-card text-card-foreground`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div
            className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center mb-3`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="flex items-center justify-between">
            <span>{option.name}</span>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
