import { TRANSACTION_FLOW } from "@/types/transaction";
import { stepsTransaction } from "@/utils/product";
import React from "react";

export function FlowProgress({ status }: { status: TRANSACTION_FLOW }) {
  // Find current step index
  const currentStepIndex = stepsTransaction.findIndex(
    (step) => step.id === status
  );

  return (
    <div className="w-full pt-20 pb-10 md:flex md:flex-col hidden">
      {/* Progress container with modern styling */}
      <div className="relative  rounded-2xl p-8 shadow-sm ">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-green-500 rounded-full blur-xl"></div>
        </div>

        {/* Steps container */}
        <div className="flex items-start justify-between relative z-10">
          {stepsTransaction.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative flex-1 group"
              >
                {/* Connection line - left half */}
                {index > 0 && (
                  <div className="absolute left-0 right-1/2 top-7 -translate-y-1/2">
                    <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out rounded-full ${
                          isActive || isCompleted
                            ? "bg-gradient-to-r from-blue-500 to-green-500 w-full"
                            : "w-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Connection line - right half */}
                {index < stepsTransaction.length - 1 && (
                  <div className="absolute left-1/2 right-0 top-7 -translate-y-1/2">
                    <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out rounded-full ${
                          isCompleted
                            ? "bg-gradient-to-r from-blue-500 to-green-500 w-full"
                            : "w-0"
                        }`}
                        style={{
                          transitionDelay: isCompleted
                            ? `${index * 200}ms`
                            : "0ms",
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Step circle with enhanced styling */}
                <div className="relative">
                  {/* Glow effect for active step */}
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30 animate-pulse"></div>
                  )}

                  {/* Success glow for completed steps */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-20"></div>
                  )}

                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-500 transform group-hover:scale-105 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200"
                        : isActive
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                        : "bg-white text-gray-400 border-2 border-gray-200 shadow-sm"
                    }`}
                  >
                    <StepIcon
                      className={`transition-all duration-300 ${
                        isCompleted || isActive ? "w-7 h-7" : "w-6 h-6"
                      }`}
                    />
                  </div>

                  {/* Checkmark overlay for completed steps */}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Step content with enhanced typography */}
                <div className="mt-4 text-center max-w-32">
                  <p
                    className={`font-semibold text-sm transition-colors duration-300 ${
                      isCompleted
                        ? "text-green-600"
                        : isActive
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-xs mt-1 leading-tight transition-colors duration-300 ${
                      isCompleted
                        ? "text-green-500"
                        : isActive
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Status indicator text */}
                  <div className="mt-2">
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Selesai
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 animate-pulse">
                        Sedang Proses
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlowProgress;
