import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Welcome to the Dashboard</h1>
      <p>You are signed in as {session.user?.name}</p>
      <Button>Sign out</Button>
    </div>
  );
}
