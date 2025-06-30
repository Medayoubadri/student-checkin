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
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">Eng</SelectItem>
        <SelectItem value="fr">Fr</SelectItem>
      </SelectContent>
    </Select>
  );
}
