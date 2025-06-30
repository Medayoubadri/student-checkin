"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface FileInputProps {
  onFileSelect: (file: File) => void;
}

export function FileInput({ onFileSelect }: FileInputProps) {
  const t = useTranslations("ImportModal");
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="flex items-center gap-2 pr-2 border rounded-md w-full">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="csvFile"
      />
      <Button
        variant="secondary"
        onClick={() => document.getElementById("csvFile")?.click()}
      >
        {t("chooseFile")}
      </Button>
      <span className="ml-3 w-40 text-muted-foreground text-xs truncate">
        {fileName || t("noFileChosen")}
      </span>
    </div>
  );
}
