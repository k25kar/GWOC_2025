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

  // State to toggle login type: "user" for normal users, "sp" for service providers.
  const [loginType, setLoginType] = useState<"user" | "sp">("user");

  /**
   * Check the login status for a given email based on the login type.
   * For service providers, only allow login if the status is "approved".
   * Otherwise, return an error message.
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
   *   Then call our custom login endpoint and, if successful,
   *   create a NextAuth session via the credentials provider.
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
          // After a successful user login, redirect to the desired page.
          router.push(redirect || "/");
        }
      } catch (err) {
        toast.error(getError(err), {
          style: { backgroundColor: "#800000", color: "#fff" },
        });
      }
    } else if (loginType === "sp") {
      try {
        // First, call our custom API route to verify SP credentials and status.
        const { data } = await axios.post("/api/auth/login-sp", {
          email,
          password,
        });
        if (data.message === "Login successful") {
          // Now create a NextAuth session (assuming your credentials provider
          // supports a "loginType" field to differentiate SP logins).
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
            // Redirect directly to the SP dashboard overview.
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

  // Handle Google sign in.
  const handleGoogleSignIn = async () => {
    try {
      const result: any = await signIn("google", { redirect: false });
      if (result.error) {
        toast.error(result.error, {
          style: { backgroundColor: "#800000", color: "#fff" },
        });
        return;
      }
      // Wait for session update.
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
      // Successful Google login; redirect based on login type.
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

  // Optionally, if a session already exists, you could perform a status check and auto-redirect.
  useEffect(() => {
    const userEmail = session?.user?.email;
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
      // Uncomment the next line if you want to auto-redirect if a session exists:
      // checkStatus();
    }
  }, [session, redirect, router, loginType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] overflow-x-hidden px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="p-6 sm:p-8 space-y-6 bg-[#1a1a1a] rounded-md shadow-md">
          <h1 className="text-3xl font-semibold text-white text-center">Sign In</h1>

          {/* Toggle Buttons to Choose Login Type */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => setLoginType("user")}
              className={`px-4 py-2 mr-2 rounded-md ${
                loginType === "user"
                  ? "bg-[#800000] text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setLoginType("sp")}
              className={`px-4 py-2 rounded-md ${
                loginType === "sp"
                  ? "bg-[#800000] text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              Service Provider
            </button>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#141414] hover:bg-[#ffffff] hover:text-black text-white font-medium transition-colors"
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

          {/* Formik Form for Email & Password */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  E-mail
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md 
                             focus:outline-none focus:border-[#800000]"
                />
                <div className="text-red-500 text-sm mt-1">
                  <ErrorMessage name="email" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md 
                             focus:outline-none focus:border-[#800000]"
                />
                <div className="text-red-500 text-sm mt-1">
                  <ErrorMessage name="password" />
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-2 bg-[#141414] hover:bg-[#ffffff] hover:text-black text-white font-semibold
                           rounded-md transition-colors"
              >
                Sign In
              </button>

              {/* Bottom Links */}
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
                    href="/forgot-password"
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
