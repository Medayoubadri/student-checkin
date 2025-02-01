export interface ImportResult {
  totalRecords: number;
  cleanedRecords: number;
  uniqueRecords: number;
  processedRecords: number;
  importedOrUpdatedRecords: number;
  skippedRecords: number;
  skippedRecordsDetails?: Array<{
    record: Record<string, unknown>;
    reason: string;
  }>;
  error?: string;
}

export interface ColumnMapping {
  [key: string]: string;
}

export interface ImportProgress {
  currentStep: "cleaning" | "deduplicating" | "importing";
  processedRecords: number;
  totalRecords: number;
}
