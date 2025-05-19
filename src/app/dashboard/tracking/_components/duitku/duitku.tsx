import { useState } from "react";
import { motion } from "framer-motion";
import { TransactionContent } from "./transaction";

export function DuitkuServices(): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    {
      id: 1,
      name: "Cek Saldo",
      key: "CS",
    },
    {
      id: 2,
      name: "Cek Transactions",
      key: "CT",
    },
  ];

  function handleOptionClick(index: number) {
    setSelectedOption(index);
  }

  return (
    <section className="w-full mt-4 p-4 rounded-xl ">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ duration: 0.2 }}
            className={`cursor-pointer rounded-xl p-3 bg-blue-800 shadow-sm`}
            onClick={() => handleOptionClick(index + 1)}
          >
            {item.name}
          </motion.div>
        ))}
      </div>
      {selectedOption === 2 && <TransactionContent />}
    </section>
  );
}
