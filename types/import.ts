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

export interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
}

export interface ImportProgress {
  currentStep: "cleaning" | "deduplicating" | "importing";
  processedRecords: number;
  totalRecords: number;
}
