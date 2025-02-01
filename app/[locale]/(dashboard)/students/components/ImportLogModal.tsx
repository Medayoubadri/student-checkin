import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ImportResult } from "@/types/import";
import { useTranslations } from "next-intl";
import {
  FileText,
  CheckCircle,
  Filter,
  Cog,
  Upload,
  SkipForward,
  AlertTriangle,
} from "lucide-react";

interface ImportLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  importResult: ImportResult | null;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      className={`dark:bg-zinc-950 bg-slate-200 rounded-lg shadow p-4 flex items-center space-x-4 border-l-4 ${color}`}
    >
      <Icon className="w-8 h-8 text-gray-500" />
      <div>
        <p className="font-medium text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-2xl">{value}</p>
      </div>
    </div>
  );
}

export function ImportLogModal({
  isOpen,
  onClose,
  importResult,
}: ImportLogModalProps) {
  const t = useTranslations("ImportLogModal");

  if (!importResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-100 dark:bg-background py-5 sm:max-w-[600px] h-[600px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-center w-full text-3xl">
            {importResult.error ? (
              <span className="text-red-500">{t("errorTitle")}</span>
            ) : (
              <span className="text-primary">{t("successTitle")}</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {importResult.error ? (
            <div className="bg-red-100 p-4 border-red-500 border-l-4 rounded-lg text-red-700">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 w-6 h-6" />
                <p>{importResult.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="gap-4 grid grid-cols-2">
                <StatCard
                  icon={FileText}
                  label={t("totalRecords")}
                  value={importResult.totalRecords}
                  color="border-blue-500"
                />
                <StatCard
                  icon={CheckCircle}
                  label={t("cleanedRecords")}
                  value={importResult.cleanedRecords}
                  color="border-green-500"
                />
                <StatCard
                  icon={Filter}
                  label={t("uniqueRecords")}
                  value={importResult.uniqueRecords}
                  color="border-purple-500"
                />
                <StatCard
                  icon={Cog}
                  label={t("processedRecords")}
                  value={importResult.processedRecords}
                  color="border-yellow-500"
                />
                <StatCard
                  icon={Upload}
                  label={t("importedOrUpdatedRecords")}
                  value={importResult.importedOrUpdatedRecords}
                  color="border-indigo-500"
                />
                <StatCard
                  icon={SkipForward}
                  label={t("skippedRecords")}
                  value={importResult.skippedRecords || "0"}
                  color="border-red-500"
                />
              </div>
              {importResult.skippedRecordsDetails &&
                importResult.skippedRecordsDetails.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 font-semibold text-lg">
                      {t("skippedRecordsDetails")}:
                    </h3>
                    <ul className="space-y-2 h-24">
                      {importResult.skippedRecordsDetails.map(
                        (record, index) => (
                          <li
                            key={index}
                            className="flex flex-col gap-2 bg-red-800/10 shadow-md p-5 border-red-500 border-l-4 rounded-lg"
                          >
                            <span className="font-medium">
                              {t("record")}:{" "}
                              {JSON.stringify(record.record).replaceAll(
                                /""/g,
                                ""
                              )}
                              ,
                            </span>
                            <span className="font-medium">
                              {t("reason")}: {record.reason}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
