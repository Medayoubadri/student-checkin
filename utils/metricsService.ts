// utils/metricsService.ts - Service for handling attendance metrics with client-side caching

const METRICS_CACHE_KEY = "metrics";
const CACHE_TTL = 60 * 120 * 1000; // 2 hours

interface Metrics {
  totalStudents: number;
  todayAttendance: number;
  averageAttendance: number;
  totalAttendance: number;
}

export const metricsService = {
  // Fetches attendance metrics with cache support
  async getMetrics(): Promise<Metrics> {
    const cached = localStorage.getItem(METRICS_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    const response = await fetch("/api/metrics");
    const data = await response.json();
    localStorage.setItem(
      METRICS_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return data;
  },

  // Clears the metrics cache
  async invalidateCache() {
    localStorage.removeItem(METRICS_CACHE_KEY);
  },
};
