"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signIn, useSession, getSession } from "next-auth/react";
import * as Yup from "yup";
import { getError } from "@/lib/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: any = router.query;

  // Toggle between user or service provider
  const [loginType, setLoginType] = useState<"user" | "sp">("user");

  /**
   * Check the login status for a given email based on the login type.
   * For service providers, only allow login if the status is "approved".
   */
  const checkLoginStatus = async (
    email: string,
    loginType: "user" | "sp"
  ): Promise<string | null> => {
    if (loginType === "user") {
      try {
        const userRes = await axios.get(
          `/api/auth/check-user?email=${encodeURIComponent(email)}`
        );
        if (userRes.status === 200 && userRes.data.exists) {
          return null;
        } else {
          return "User not found";
        }
      } catch (error) {
        console.log("User check error", error);
        return "User not found";
      }
    } else if (loginType === "sp") {
      try {
        const partnerRes = await axios.get(
          `/api/auth/check-provider-status?email=${encodeURIComponent(email)}`
        );
        if (partnerRes.status === 200) {
          const status: string = partnerRes.data.status;
          if (status === "approved") {
            return null;
          } else {
            return "Application not approved yet";
          }
        }
      } catch (error) {
        console.log("Service Provider check error", error);
        return "Service provider not found";
      }
    }
    return null;
  };

  /**
   * Handle form submission:
   * - For normal users, use NextAuth’s credentials provider.
   * - For service providers, first check if the account is approved.
   */
  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    const errorMsg = await checkLoginStatus(email, loginType);
    if (errorMsg) {
      toast.error(errorMsg, {
        autoClose: 3000,
        style: { backgroundColor: "#800000", color: "#fff" },
      });
      return;
    }

    if (loginType === "user") {
      try {
        const result: any = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result.error) {
          toast.error(result.error, {
            style: { backgroundColor: "#800000", color: "#fff" },
          });
        } else {
          router.push(redirect || "/");
        }
      } catch (err) {
        toast.error(getError(err), {
          style: { backgroundColor: "#800000", color: "#fff" },
        });
      }
    } else if (loginType === "sp") {
      try {
        // Check SP credentials
        const { data } = await axios.post("/api/auth/login-sp", {
          email,
          password,
        });
        if (data.message === "Login successful") {
          // Create NextAuth session
          const result: any = await signIn("credentials", {
            redirect: false,
            email,
            password,
            loginType: "sp",
          });
          if (result.error) {
            toast.error(result.error, {
              style: { backgroundColor: "#800000", color: "#fff" },
            });
          } else {
            toast.success("Service Provider login successful", {
              style: { backgroundColor: "#141414", color: "#fff" },
            });
            router.push("/dashboard/spdashboard/overview");
          }
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Service Provider login failed",
          {
            style: { backgroundColor: "#800000", color: "#fff" },
          }
        );
      }
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      const result: any = await signIn("google", { redirect: false });
      if (result.error) {
        toast.error(result.error, {
          style: { backgroundColor: "#800000", color: "#fff" },
        });
        return;
      }
      const sessionAfter = await getSession();
      if (sessionAfter?.user?.email) {
        const status = await checkLoginStatus(sessionAfter.user.email, loginType);
        if (status) {
          toast.error(status, {
            autoClose: 3000,
            style: { backgroundColor: "#800000", color: "#fff" },
          });
          return;
        }
      }
      if (loginType === "sp") {
        router.push("/dashboard/spdashboard/overview");
      } else {
        router.push(redirect || "/");
      }
    } catch (err) {
      toast.error(getError(err), {
        style: { backgroundColor: "#800000", color: "#fff" },
      });
    }
  };

  // Optionally auto-redirect if session already exists
  const { data: userSession } = useSession();
  useEffect(() => {
    const userEmail = userSession?.user?.email;
    if (typeof userEmail === "string") {
      const checkStatus = async () => {
        const statusMsg = await checkLoginStatus(userEmail, loginType);
        if (statusMsg) {
          toast.error(statusMsg, {
            autoClose: 3000,
            style: { backgroundColor: "#800000", color: "#fff" },
          });
        } else {
          if (loginType === "sp") {
            router.push("/dashboard/spdashboard/overview");
          } else {
            router.push(redirect || "/");
          }
        }
      };
      // Uncomment if you want to auto-redirect:
      // checkStatus();
    }
  }, [userSession, redirect, router, loginType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white overflow-x-hidden px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Outer card */}
        <div className="p-6 sm:p-8 space-y-6 bg-black rounded-lg shadow-lg relative">
          {/* Go Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-3 left-3 text-sm text-gray-400 hover:text-white"
          >
            &larr; Go Back
          </button>

          <h1 className="text-3xl font-semibold text-white text-center">
            Sign In
          </h1>

          {/* "As User" / "As Service Provider" tabs */}
          <div className="flex justify-center items-center gap-8 border-b border-gray-600 pb-1">
            <button
              type="button"
              onClick={() => setLoginType("user")}
              className={`text-sm font-semibold pb-1 transition-colors ${
                loginType === "user"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              As User
            </button>
            <button
              type="button"
              onClick={() => setLoginType("sp")}
              className={`text-sm font-semibold pb-1 transition-colors ${
                loginType === "sp"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              As Service Provider
            </button>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          {/* Separator */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-600" />
            <span className="px-2 text-gray-400">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  E-mail
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <div className="text-red-500 text-sm mt-1">
                  <ErrorMessage name="email" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <div className="text-red-500 text-sm mt-1">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-md transition-colors"
              >
                Sign In
              </button>
              <div className="text-center text-sm text-gray-400 space-y-2 mt-4">
                <p>
                  Don&apos;t have an account? &nbsp;
                  <Link
                    className="text-[#800000] hover:underline"
                    href={`./signup?redirect=${redirect || "/"}`}
                  >
                    Create an account
                  </Link>
                </p>
                <p>
                  <Link
                    className="text-[#800000] hover:underline"
                    href="/reset-password"
                  >
                    Forgot password?
                  </Link>
                </p>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
