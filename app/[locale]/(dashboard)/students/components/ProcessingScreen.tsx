// app/[locale]/dashboard/students/components/ProcessingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const processingSteps = [
  "processingStep1",
  "processingStep2",
  "processingStep3",
  "processingStep4",
];

// ProcessingScreen component for displaying the processing status
// This component shows a loading spinner, progress bar, and step indicators
// It updates the progress and current step at regular intervals
export function ProcessingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const t = useTranslations("ProcessingScreen");

  // Effect to handle the step and progress updates
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % processingSteps.length);
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Render the processing screen
  return (
    <div className="flex flex-col justify-center items-center space-y-8 mx-auto p-8 max-w-md">
      <div className="w-full">
        <Progress value={progress} className="w-full h-2" />
        <p className="mt-2 text-gray-500 text-sm text-right">{progress}%</p>
      </div>

      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="font-medium text-sm">
            {currentStep + 1}/{processingSteps.length}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="font-semibold text-primary text-lg">
          {t(processingSteps[currentStep])}
        </p>
        <p className="text-gray-500 text-sm">{t("pleaseWait")}</p>
      </div>

      <div className="w-full">
        {processingSteps.map((step, index) => (
          <div key={step} className="flex items-center mb-2">
            <div
              className={`w-4 h-4 rounded-full mr-3 ${
                index <= currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
            <p
              className={`text-sm ${
                index <= currentStep
                  ? "text-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              {t(step)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
