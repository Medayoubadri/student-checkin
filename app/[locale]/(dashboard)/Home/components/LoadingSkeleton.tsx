// Component for loading skeletons in the dashboard
export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 md:mt-0 p-4 md:p-6 w-full h-full overflow-y-hidden">
      <div className="flex flex-col items-center gap-4 w-full lg:max-w-7xl">
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          {/* Student Check-in skeleton */}
          <div className="bg-gray-200 dark:bg-zinc-900 rounded-lg w-full lg:w-1/2 h-[300px] animate-pulse"></div>
          {/* Attendance Log skeleton */}
          <div className="bg-gray-200 dark:bg-zinc-900 rounded-lg w-full lg:w-1/2 h-[300px] animate-pulse"></div>
        </div>
        {/* Metrics Cards skeleton */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-zinc-900 rounded-lg h-32 animate-pulse"
            ></div>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="hidden lg:block bg-gray-200 dark:bg-zinc-900 rounded-lg w-full h-[400px] animate-pulse"></div>
      </div>
    </div>
  );
}
