import Link from "next/link";
import { TextHoverEffect } from "./ui/text-hover-effect";

// This component renders the footer of the application
export function Footer() {
  return (
    <footer className="py-6 md:py-0 border-t w-full">
      <div className="hidden md:flex justify-center items-center h-[13rem]">
        <TextHoverEffect text="CHECK-IN MATE" />
      </div>
      <div className="flex md:flex-row flex-col justify-between items-center gap-4 mx-auto md:h-20 container">
        <p className="text-muted-foreground text-sm md:text-left text-center leading-loose">
          © {new Date().getFullYear()} Check-In Mate. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/medayoubadri/student-checkin"
            className="text-muted-foreground text-sm hover:underline underline-offset-4"
          >
            GitHub
          </Link>
          <Link
            href="/auth/signin"
            className="text-muted-foreground text-sm hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
