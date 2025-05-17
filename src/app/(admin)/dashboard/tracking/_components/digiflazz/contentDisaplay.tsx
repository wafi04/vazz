import React, { ReactNode } from "react";
import { ContentData, DigiflazzOption } from "./digiflazz";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Animation variants for reuse
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const ContentDisplay: React.FC<{
  selectedOption: DigiflazzOption;
  contentData: ContentData | null;
  onClose: () => void;
  renderContent: () => ReactNode;
}> = ({ selectedOption, contentData, onClose, renderContent }) => {
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <Card className="mt-8 border border-primary/50 shadow-lg overflow-hidden">
        <div className={`h-2 ${selectedOption.color} w-full`}></div>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${selectedOption.color} flex items-center justify-center mr-3`}
            >
              {React.createElement(selectedOption.icon, {
                className: "w-4 h-4 text-white",
              })}
            </div>
            {selectedOption.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">{renderContent()}</CardContent>
      </Card>
    </motion.div>
  );
};
