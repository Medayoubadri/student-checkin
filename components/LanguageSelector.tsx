"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This component provides a language selector for switching between languages
// It uses Next.js router and next-intl for localization
export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLanguage = (newLocale: string) => {
    const currentPathname = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPathname}`);
  };

  return (
    <Select value={locale} onValueChange={changeLanguage}>
      <SelectTrigger className="bg-background w-fit">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="fr">Fr</SelectItem>
        <SelectItem value="en">Eng</SelectItem>
      </SelectContent>
    </Select>
  );
}
