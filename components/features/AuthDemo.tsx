"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Fingerprint,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

// This component is responsible for rendering the authentication demo
// It simulates an authentication process with email verification
export function AuthenticationDemo() {
  const [authStep, setAuthStep] = useState<number>(0);
  const [email, setEmail] = useState("student@university.edu");
  const [isVerified, setIsVerified] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Initial delay before starting the demo
    timers.push(
      setTimeout(() => {
        // Step 1: Select email authentication
        setAuthStep(1);

        // Step 2: Show email sent
        timers.push(
          setTimeout(() => {
            setAuthStep(2);

            // Step 3: Show verification success
            timers.push(
              setTimeout(() => {
                setIsVerified(true);

                // Reset after showing success
                timers.push(
                  setTimeout(() => {
                    setIsVerified(false);
                    setAuthStep(0);
                  }, 3000)
                );
              }, 2500)
            );
          }, 2500)
        );
      }, 1500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isVerified]);

  const handleNextStep = () => {
    if (authStep < 2) {
      setAuthStep(authStep + 1);
    } else {
      setIsVerified(true);
    }
  };

  const handleReset = () => {
    setAuthStep(0);
    setEmail("student@university.edu");
    setIsVerified(false);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full h-full overflow-hidden">
      {!isVerified ? (
        <>
          <div className="mb-6 font-medium text-base text-center">
            {authStep === 0 && "Choose your authentication method"}
            {authStep === 1 && "Enter your email to receive a magic link"}
            {authStep === 2 && "Check your email for the magic link"}
          </div>

          <div className="relative w-full max-w-[280px]">
            {/* Auth methods */}
            <motion.div
              className={`flex justify-center gap-6 w-full ${
                authStep > 0 ? "opacity-0" : "opacity-100"
              }`}
              animate={{
                opacity: authStep > 0 ? 0 : 1,
                y: authStep > 0 ? -20 : 0,
                position: authStep > 0 ? "absolute" : "relative",
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthStep(1)}
                className="bg-primary/10 hover:bg-primary/20 p-5 rounded-xl text-primary transition-colors"
              >
                <Mail size={32} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary/10 hover:bg-primary/20 p-5 rounded-xl text-primary transition-colors"
              >
                <Smartphone size={32} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary/10 hover:bg-primary/20 p-5 rounded-xl text-primary transition-colors"
              >
                <Fingerprint size={32} />
              </motion.button>
            </motion.div>

            {/* Email input */}
            <motion.div
              className={`w-full ${
                authStep === 1 ? "opacity-100" : "opacity-0"
              }`}
              animate={{
                opacity: authStep === 1 ? 1 : 0,
                y: authStep === 1 ? 0 : 20,
                position: authStep === 1 ? "relative" : "absolute",
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="bg-background p-3 border border-gray-300 dark:border-gray-700 border-r-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-base"
                />
                <button
                  onClick={handleNextStep}
                  disabled={!email.includes("@")}
                  className="bg-primary disabled:opacity-50 px-4 rounded-r-md text-primary-foreground text-base"
                >
                  Send
                </button>
              </div>
            </motion.div>

            {/* Email sent animation */}
            <motion.div
              className={`w-full flex flex-col items-center ${
                authStep === 2 ? "opacity-100" : "opacity-0"
              }`}
              animate={{
                opacity: authStep === 2 ? 1 : 0,
                y: authStep === 2 ? 0 : 20,
                position: authStep === 2 ? "relative" : "absolute",
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4"
              >
                <Mail size={48} className="text-primary" />
              </motion.div>
              <p className="mb-3 text-muted-foreground text-sm text-center">
                Magic link sent to:
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                className="text-primary text-sm hover:underline"
              >
                Verify now (demo)
              </motion.button>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-5 text-green-500"
          >
            <CheckCircle size={64} />
          </motion.div>
          <p className="mb-2 font-medium text-lg">Authentication Successful</p>
          <p className="mb-4 text-muted-foreground text-base">
            Welcome back, Student
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="text-primary text-sm hover:underline"
          >
            Try again
          </motion.button>
        </motion.div>
      )}

      {/* Progress indicators */}
      {!isVerified && (
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((step) => (
            <motion.div
              key={step}
              className={`h-2 rounded-full ${
                step <= authStep ? "bg-primary" : "bg-primary/20"
              }`}
              initial={{ width: 16 }}
              animate={{
                width: step === authStep ? 32 : 16,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      <div className="right-4 bottom-4 absolute">
        <ShieldCheck size={24} className="text-primary/40" />
      </div>
    </div>
  );
}
