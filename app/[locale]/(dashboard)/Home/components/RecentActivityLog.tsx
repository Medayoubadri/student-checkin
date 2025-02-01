import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadAttendance } from "./DownloadAttendance";

interface ActivityLog {
  id: string;
  studentName: string;
  timestamp: string;
}

interface RecentActivityLogProps {
  refreshTrigger: number;
}

export function RecentActivityLog({ refreshTrigger }: RecentActivityLogProps) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchRecentActivity();
  }, [refreshTrigger]);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/attendance/recent");
      const data = await response.json();
      setActivityLogs(data);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const getDayTitle = () => {
    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    return `${day}'s Check-ins`;
  };

  return (
    <Card className="bg-background w-full max-h-64 overflow-hidden">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle>{getDayTitle()}</CardTitle>
          <DownloadAttendance className="w-8 h-8" />
        </div>
      </CardHeader>
      <CardContent className="h-44 overflow-y-auto">
        <ul className="space-y-2">
          {activityLogs.map((log) => (
            <li key={log.id} className="flex justify-between items-center">
              <span>{log.studentName}</span>
              <span className="text-muted-foreground text-sm">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
