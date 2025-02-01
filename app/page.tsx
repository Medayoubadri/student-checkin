import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignIn from "@/app/auth/signin/page";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/Home");
  }
  return (
    <>
      <SignIn />
    </>
  );
}
