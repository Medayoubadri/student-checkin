// app/services/attendanceLogService.ts

interface AttendanceEntry {
  fullName: string;
  id: string;
  dailyAttendance: number;
  totalAttendance: number;
  createdAt: string;
}

const DAILY_CACHE_KEY = "attendance-daily";
const TOTAL_CACHE_KEY = "attendance-total";
const CACHE_TTL = 60 * 120 * 1000; // 2 hours
const formatDateKey = (date: Date) => {
  // Create date at midnight in local timezone
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  // Get YYYY-MM-DD in local timezone
  return `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
};

export const attendanceLogService = {
  async getDailyAttendance(date: Date): Promise<AttendanceEntry[]> {
    console.time("getDailyAttendance");
    const dateKey = formatDateKey(date);
    const cacheKey = `${DAILY_CACHE_KEY}-${dateKey}`;

    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp, forceRefresh } = JSON.parse(cached);
      // Only use cache if TTL is valid and no force refresh is set
      if (!forceRefresh && Date.now() - timestamp < CACHE_TTL) {
        console.timeEnd("getDailyAttendance");
        return data;
      }
    }

    // Fetch from server
    try {
      const response = await fetch(`/api/attendance/daily?date=${dateKey}`);
      if (!response.ok) throw new Error("Failed to fetch daily attendance");
      const data = await response.json();

      // Cache the result with no force refresh flag
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          forceRefresh: false,
        })
      );

      return data;
    } catch (error) {
      console.error("Failed to fetch daily attendance:", error);
      throw error;
    }
  },

  async getTotalAttendances(
    studentIds: string[]
  ): Promise<{ [key: string]: number }> {
    const cachedResults: { [key: string]: number } = {};
    const needsFetch: string[] = [];

    // Check individual cache entries
    studentIds.forEach((id) => {
      const cacheKey = `${TOTAL_CACHE_KEY}-${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          cachedResults[id] = data;
          return;
        }
      }
      needsFetch.push(id);
    });

    if (needsFetch.length === 0) return cachedResults;

    // Batch fetch only missing entries
    try {
      const response = await fetch(
        `/api/attendance/total?studentIds=${needsFetch.join(",")}`
      );
      const freshData = await response.json();

      // Update individual caches
      Object.entries(freshData).forEach(([id, count]) => {
        const cacheKey = `${TOTAL_CACHE_KEY}-${id}`;
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: count,
            timestamp: Date.now(),
          })
        );
      });

      return { ...cachedResults, ...freshData };
    } catch (error) {
      console.error("Failed to fetch total attendances:", error);
      return cachedResults; // Return partial cached data
    }
  },

  async removeAttendance(studentId: string, date: Date): Promise<void> {
    const dateKey = date;
    const dailyCacheKey = `${DAILY_CACHE_KEY}-${dateKey}`;
    const totalCacheKey = `${TOTAL_CACHE_KEY}-${studentId}`;

    // Optimistic update
    const previousDaily = localStorage.getItem(dailyCacheKey);
    const previousTotal = localStorage.getItem(totalCacheKey);

    try {
      // Update local cache first
      if (previousDaily) {
        const { data, timestamp } = JSON.parse(previousDaily);
        const newData = data.filter(
          (entry: AttendanceEntry) => entry.id !== studentId
        );
        localStorage.setItem(
          dailyCacheKey,
          JSON.stringify({
            data: newData,
            timestamp,
          })
        );
      }

      if (previousTotal) {
        const { data, timestamp } = JSON.parse(previousTotal);
        localStorage.setItem(
          totalCacheKey,
          JSON.stringify({
            data: Math.max(0, data - 1),
            timestamp,
          })
        );
      }

      // Sync with server
      const response = await fetch(`/api/attendance/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date }),
      });

      if (!response.ok) throw new Error("Failed to remove attendance");
    } catch (error) {
      // Revert cache on error
      if (previousDaily) localStorage.setItem(dailyCacheKey, previousDaily);
      if (previousTotal) localStorage.setItem(totalCacheKey, previousTotal);
      throw error;
    }
  },

  invalidateTotalCache() {
    localStorage.removeItem(`${TOTAL_CACHE_KEY}-batch`);
  },

  invalidateCache(studentId?: string, date?: Date) {
    if (date) {
      const dateKey = formatDateKey(date);
      localStorage.removeItem(`${DAILY_CACHE_KEY}-${dateKey}`); // Remove the cache entry
    }
    if (studentId) {
      localStorage.removeItem(`${TOTAL_CACHE_KEY}-${studentId}`);
    }

    console.log("Cache invalidated for", { studentId, date });
  },
};
