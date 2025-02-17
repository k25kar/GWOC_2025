"use client";

import Link from "next/link";
import React, { useEffect } from "react";
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
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: any = router.query;

  // This function checks if the email exists in Users first.
  // If not, it checks in Partners and returns an error message based on status.
  const checkLoginStatus = async (email: string): Promise<string | null> => {
    try {
      // Check in Users collection
      const userRes = await axios.get(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
      if (userRes.status === 200 && userRes.data.exists) {
        // Normal user exists; no extra checks.
        return null;
      }
    } catch (error) {
      // Assume error means user not found in Users; continue to check Partners.
      console.log("User not found in Users; checking Partners...");
    }

    try {
      // Check in Partners collection.
      const partnerRes = await axios.get(`/api/auth/check-provider-status?email=${encodeURIComponent(email)}`);
      if (partnerRes.status === 200) {
        const status: string = partnerRes.data.status;
        if (status === "pending") {
          return "Registration under approval";
        } else if (status === "rejected") {
          return "Registration rejected";
        } else if (status === "approved") {
          return null;
        }
      }
    } catch (error) {
      // If not found in Partners, allow login (it might be a normal user)
      return null;
    }
    return null;
  };

  // Handle credentials sign in.
  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    const errorMsg = await checkLoginStatus(email);
    if (errorMsg) {
      toast.error(errorMsg, {
        autoClose: 3000,
        style: { backgroundColor: "#800000", color: "#fff" },
      });
      return;
    }
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
        // After successful login, redirect to home page.
        router.push("/");
      }
    } catch (err) {
      toast.error(getError(err), {
        style: { backgroundColor: "#800000", color: "#fff" },
      });
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
        const status = await checkLoginStatus(sessionAfter.user.email);
        if (status) {
          toast.error(status, {
            autoClose: 3000,
            style: { backgroundColor: "#800000", color: "#fff" },
          });
          return;
        }
      }
      // Successful Google login; redirect to home.
      router.push("/");
    } catch (err) {
      toast.error(getError(err), {
        style: { backgroundColor: "#800000", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    // Optionally, if a session exists already, you can perform status check and redirect.
    const userEmail = session?.user?.email;
    if (typeof userEmail === "string") {
      const checkStatus = async () => {
        const statusMsg = await checkLoginStatus(userEmail);
        if (statusMsg) {
          toast.error(statusMsg, {
            autoClose: 3000,
            style: { backgroundColor: "#800000", color: "#fff" },
          });
        } else {
          router.push(redirect || "/");
        }
      };
      // Uncomment the following if you wish to auto-redirect upon session creation:
      // checkStatus();
    }
  }, [session, redirect, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] overflow-x-hidden px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="p-6 sm:p-8 space-y-6 bg-[#1a1a1a] rounded-md shadow-md">
          <h1 className="text-3xl font-semibold text-white text-center">Sign In</h1>

          {/* Google Sign-In Button (Maroon Gradient) */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md
                       bg-[#141414] hover:bg-[#ffffff] hover:text-black text-white font-medium transition-colors"
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
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
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
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">
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

              {/* Sign In Button (Maroon Gradient) */}
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
                  <Link className="text-[#800000] hover:underline" href={`./signup?redirect=${redirect || "/"}`}>
                    Create an account
                  </Link>
                </p>
                <p>
                  <Link className="text-[#800000] hover:underline" href="/forgot-password">
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
