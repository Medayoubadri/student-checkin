import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignIn from "@/app/[locale]/auth/signin/page";
import { authOptions } from "@/lib/authOptions";

export default async function Home({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const locale = params.locale as string;

  if (session) {
    redirect(`${locale}/Home`);
  }
  return (
    <>
      <SignIn />
    </>
  );
}
