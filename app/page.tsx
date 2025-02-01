import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center p-24 min-h-screen">
      <h1 className="mb-8 font-bold text-4xl">Student Attendance System</h1>
      <Link href="/auth/signin" className="text-blue-500 hover:underline">
        Sign In
      </Link>
    </main>
  );
}
