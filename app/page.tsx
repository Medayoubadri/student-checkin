import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignIn from "@/app/auth/signin/page";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/Home");
  }
  return (
    <>
      <SignIn />
    </>
  );
}
