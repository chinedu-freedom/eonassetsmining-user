"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePost, useFetchData } from "@/hooks/useApi";

function VerifyEmailContent() {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(600);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInitialCountdown, setIsInitialCountdown] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resendEmailMutation = usePost("/auth/resend-verification", null);

  const { data: verificationData, isLoading: isVerifying, isError: isVerificationError, error: verificationError } = useFetchData(
    `/auth/verify-email?token=${token}`,
    ["verify-email", token],
    { enabled: !!token, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (token) return; // Don't run countdown logic if verifying token

    const savedCountdown = localStorage.getItem("verificationCountdown");
    const lastResendTime = localStorage.getItem("lastVerificationResend");
    const isInitial = localStorage.getItem("isInitialCountdown");

    if (savedCountdown && lastResendTime) {
      const timePassed = Math.floor(
        (Date.now() - parseInt(lastResendTime)) / 1000
      );
      const remainingTime = parseInt(savedCountdown) - timePassed;

      if (remainingTime > 0) {
        setCountdown(remainingTime);
        setIsInitialCountdown(isInitial === "true");
      } else {
        localStorage.removeItem("verificationCountdown");
        localStorage.removeItem("lastVerificationResend");
        localStorage.removeItem("isInitialCountdown");
        setCountdown(0);
        setIsInitialCountdown(false);
      }
    } else {
      setCountdown(600);
      setIsInitialCountdown(true);
      localStorage.setItem("verificationCountdown", "600");
      localStorage.setItem(
        "lastVerificationResend",
        Date.now().toString()
      );
      localStorage.setItem("isInitialCountdown", "true");
    }
  }, [token]);

  useEffect(() => {
    if (token) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        const newCountdown = countdown - 1;
        setCountdown(newCountdown);
        localStorage.setItem(
          "verificationCountdown",
          newCountdown.toString()
        );

        if (newCountdown === 0) {
          localStorage.removeItem("verificationCountdown");
          localStorage.removeItem("lastVerificationResend");
          localStorage.removeItem("isInitialCountdown");
          setIsInitialCountdown(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, token]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setErrorMessage("");

      const email = localStorage.getItem("registerEmail") || "";

      if (!email) {
        setErrorMessage("No email found. Please register again.");
        setIsResending(false);
        return;
      }

      resendEmailMutation.mutate(
        { email },
        {
          onSuccess: (res) => {
            if (res.success) {
              const newCountdown = 600;
              setCountdown(newCountdown);
              setResendCount((prev) => prev + 1);
              setShowSuccess(true);
              setIsInitialCountdown(false);

              localStorage.setItem(
                "verificationCountdown",
                newCountdown.toString()
              );
              localStorage.setItem(
                "lastVerificationResend",
                Date.now().toString()
              );
              localStorage.setItem("isInitialCountdown", "false");

              setTimeout(() => setShowSuccess(false), 5000);
            } else {
              setErrorMessage(
                res.message || "Failed to resend verification email"
              );
            }
          },
          onError: () => {
            setErrorMessage(
              "Something went wrong. Please try again later."
            );
          },
        }
      );
    } catch {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  const handleContinue = () => {
    localStorage.removeItem("verificationCountdown");
    localStorage.removeItem("lastVerificationResend");
    localStorage.removeItem("isInitialCountdown");
    router.push("/");
  };

  const isButtonDisabled =
    isResending || resendEmailMutation.isPending || countdown > 0;

  const getButtonText = () => {
    if (isResending || resendEmailMutation.isPending) {
      return "Sending...";
    }

    if (countdown > 0) {
      if (isInitialCountdown) {
        return `Resend after: ${formatCountdown(countdown)}`;
      } else {
        return `Resend in ${formatCountdown(countdown)}`;
      }
    }

    return "Resend Verification Email";
  };

  const getButtonIcon = () => {
    if (isResending || resendEmailMutation.isPending) {
      return <RefreshCw className="w-4 h-4 mr-2 animate-spin" />;
    }

    if (countdown > 0) {
      return <Clock className="w-4 h-4 mr-2" />;
    }

    return <RefreshCw className="w-4 h-4 mr-2" />;
  };

  if (token) {
    if (isVerifying) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
          </div>
        </div>
      );
    }

    if (isVerificationError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full p-4">
          <Card className="w-full max-w-md p-8 text-center shadow-lg border-gray-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{verificationError?.message || "Invalid or expired token."}</p>
            <Button onClick={() => router.push("/auth/verify-email")} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white">
              Request New Link
            </Button>
          </Card>
        </div>
      );
    }

    if (verificationData?.success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full p-4">
          <Card className="w-full max-w-md p-8 text-center shadow-lg border-gray-100">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now log in.</p>
            <Button onClick={() => router.push("/")} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
              Go to Login
            </Button>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col justify-center items-center w-full max-w-xl px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Verify Your Email
            </h1>
            <p className="text-gray-500 text-sm">
              We've sent a verification link to your email address
            </p>
          </div>

          <Card className="border border-gray-200 shadow-sm mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Check your inbox
                  </h3>
                  <p className="text-sm text-gray-600">
                    We've sent a verification email to your registered
                    address. Click the link in the email to verify your
                    account.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      {isInitialCountdown
                        ? "Please wait before resending"
                        : "Didn't receive the email?"}
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Check your spam or junk folder</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>
                          Make sure you entered the correct email address
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Wait a few minutes for the email to arrive</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium text-red-700">
                  {errorMessage}
                </p>
              </div>
            )}

            <Button
              onClick={handleResendEmail}
              variant={isButtonDisabled ? "outline" : "default"}
              className={`w-full h-12 ${isButtonDisabled
                  ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              disabled={isButtonDisabled}
            >
              {getButtonIcon()}
              {getButtonText()}
            </Button>

            {showSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    Verification email sent successfully!
                  </p>
                  <p className="text-xs text-green-600">
                    Please check your inbox. You can resend again in 10
                    minutes.
                  </p>
                </div>
              </div>
            )}

            {resendCount > 0 && !showSuccess && countdown === 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  You have resent the verification email {resendCount} time
                  {resendCount > 1 ? "s" : ""}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 text-center">
                Already verified your email or want to continue?
              </p>
              <Button
                onClick={handleContinue}
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Continue to Login
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-blue-600 font-medium hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>


    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
