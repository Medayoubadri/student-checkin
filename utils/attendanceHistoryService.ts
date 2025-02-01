// app/services/attendanceHistoryService.ts
const HISTORY_CACHE_KEY = "attendance-history";
const CACHE_TTL = 60 * 120 * 1000; // 2 hours

interface AttendanceData {
  date: string;
  attendance: number;
}

export const attendanceHistoryService = {
  async getHistory(): Promise<AttendanceData[]> {
    const cached = localStorage.getItem(HISTORY_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    const response = await fetch("/api/attendance/history");
    if (!response.ok) {
      throw new Error("Failed to fetch attendance history");
    }
    const data = await response.json();
    localStorage.setItem(
      HISTORY_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return data;
  },

  invalidateCache(): boolean {
    try {
      localStorage.removeItem(HISTORY_CACHE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to invalidate attendance cache:", error);
      return false;
    }
  },
};
