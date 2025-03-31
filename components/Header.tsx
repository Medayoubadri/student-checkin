"use client";

import { Button } from "@/components/ui/button";
import { AnimatedComponent } from "@/lib/framer-animations";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { CheckCircle2Icon, Loader2, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// This is a list of navigation links used in the header
export const NAV_LINKS = [
  {
    name: "About",
    link: "#about",
  },
  {
    name: "Features",
    link: "#features",
  },
  {
    name: "Contact",
    link: "#contact",
  },
];

// This component provides a header with navigation links and a button
// It uses Framer Motion for animations and Next.js for routing
export function Header() {
  const { data: session } = useSession();
  const user = session ? session.user : null;
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // Set loading to false when the session status is determined
    // regardless of whether the user is logged in or not
    setLoading(false);
  }, [session]);

  const { scrollY } = useScroll({
    target: ref as RefObject<HTMLDivElement>,
    offset: ["start start", "end start"],
  });

  const handleNavigation = () => {
    if (user) {
      window.location.href = "/Home";
    } else {
      window.location.href = "/auth/signin";
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <header className="top-0 z-50 fixed inset-x-0 mx-auto w-full container">
      {/* Desktop */}
      <motion.div
        animate={{
          width: visible ? "50%" : "100%",
          y: visible ? 16 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 40,
        }}
        style={{
          minWidth: "900px",
        }}
        className={cn(
          "hidden lg:flex bg-transparent items-center justify-between rounded-xl relative z-[50] mx-auto w-full backdrop-blur-lg p-4",
          visible && "bg-background/60 border w-full px-4 py-2"
        )}
      >
        <div className="flex justify-between items-center lg:px-4">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="relative flex items-center gap-2">
              <Image
                width={24}
                height={24}
                src="/chess-logo.svg"
                alt="Logo"
                className="w-max h-6"
              />
              <span className="font-bold text-lg">Check-in Mate</span>
            </Link>
          </motion.div>

          <div className="hidden absolute inset-0 lg:flex flex-row flex-1 justify-center items-center gap-x-2 mx-auto w-max font-medium text-muted-foreground text-sm">
            <AnimatePresence>
              {NAV_LINKS.map((link, index) => (
                <AnimatedComponent
                  key={index}
                  animation="fadeIn"
                  delay={0.1 * index}
                >
                  <div className="relative">
                    <Link
                      href={link.link}
                      className="hover:bg-accent px-4 py-2 rounded-md hover:text-foreground transition-all duration-500"
                    >
                      {link.name}
                    </Link>
                  </div>
                </AnimatedComponent>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <AnimatedComponent animation="slideLeft" delay={0.1}>
          <div className="flex items-center gap-x-4">
            <Button
              className="bg-emerald-600 hover:bg-emerald-600/90 border-none min-w-[130px]"
              variant={visible ? "outline" : "ghost"}
              onClick={handleNavigation}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : session?.user ? (
                `👋 ${user?.name}`
              ) : (
                "⚡ Get Started"
              )}
            </Button>
          </div>
        </AnimatedComponent>
      </motion.div>

      {/* Mobile */}
      <motion.div
        animate={{
          y: visible ? 16 : 0,
          borderTopLeftRadius: open ? "0.75rem" : "2rem",
          borderTopRightRadius: open ? "0.75rem" : "2rem",
          borderBottomLeftRadius: open ? "0" : "2rem",
          borderBottomRightRadius: open ? "0" : "2rem",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center  py-4 z-50",
          visible && "bg-neutral-950 w-11/12 border",
          open && "border-transparent"
        )}
      >
        <div className="flex justify-between items-center lg:px-4">
          <div className="flex justify-between items-center gap-x-4 w-full">
            <AnimatedComponent animation="slideRight" delay={0.1}>
              <Link href="/">
                <CheckCircle2Icon className="-mt-1 w-max h-6" />
                <span className="font-bold text-lg">Student Check-in</span>
              </Link>
            </AnimatedComponent>

            <AnimatedComponent animation="slideLeft" delay={0.1}>
              <div className="flex justify-center items-center gap-x-4">
                <Button size="sm">
                  <Link href="/signup" className="flex items-center">
                    Get started
                  </Link>
                </Button>
                {open ? (
                  <XIcon
                    className="text-black dark:text-white"
                    onClick={() => setOpen(!open)}
                  />
                ) : (
                  <MenuIcon
                    className="text-black dark:text-white"
                    onClick={() => setOpen(!open)}
                  />
                )}
              </div>
            </AnimatedComponent>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="top-16 z-50 absolute inset-x-0 flex flex-col justify-start items-start gap-2 bg-neutral-950 shadow-neutral-950 shadow-xl px-4 py-8 rounded-b-xl w-full"
            >
              {NAV_LINKS.map(
                (navItem: { link: string; name: string }, idx: number) => (
                  <AnimatedComponent
                    key={`link=${idx}`}
                    animation="slideRight"
                    delay={0.1 * (idx + 1)}
                    className="w-full"
                  >
                    <Link
                      href={navItem.link}
                      onClick={() => setOpen(false)}
                      className="relative hover:bg-neutral-800 px-4 py-2 rounded-lg w-full text-neutral-300"
                    >
                      <motion.span>{navItem.name}</motion.span>
                    </Link>
                  </AnimatedComponent>
                )
              )}
              <AnimatedComponent
                animation="slideUp"
                delay={0.5}
                className="w-full"
              >
                {user ? (
                  <Link href="/Home" className="w-full">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="default"
                      className="md:hidden block w-full"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signin" className="w-full">
                      <Button
                        onClick={() => setOpen(false)}
                        variant="secondary"
                        className="md:hidden block w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button
                        onClick={() => setOpen(false)}
                        variant="default"
                        className="md:hidden block w-full"
                      >
                        Start for free
                      </Button>
                    </Link>
                  </>
                )}
              </AnimatedComponent>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

export default Header;
