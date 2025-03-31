import { useTranslations } from "next-intl";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// CustomTooltip component for rendering tooltips in charts
// This component is used to display additional information when hovering over chart elements
export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const t = useTranslations("AttendanceLog");
  if (active && payload && payload.length) {
    return (
      <div className="bg-background shadow-lg p-4 border border-green-700 rounded-xl">
        <p className="text-sm">{`Date: ${label}`}</p>
        <p className="font-semibold text-sm">{`${t("attendance")}: ${
          payload[0].value
        }`}</p>
      </div>
    );
  }
  return null;
};
