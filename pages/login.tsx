"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signIn, useSession } from "next-auth/react";
import * as Yup from "yup";
import { getError } from "@/lib/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc"; // React Icons: Google Icon
import Image from "next/image"; // If needed

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

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      const result: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] overflow-x-hidden px-4">
      {/* Outer container ensures no horizontal scroll */}
      <div className="max-w-md w-full mx-auto">
        <div className="p-6 sm:p-8 space-y-6 bg-[#1a1a1a] rounded-md shadow-md">
          <h1 className="text-3xl font-semibold text-white text-center">Sign In</h1>

          {/* Google Sign-In Button (Maroon Gradient) */}
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md
                       bg-gradient-to-r from-[#800000] to-[#8B0000] hover:from-[#8B0000] hover:to-[#700000]
                       text-white font-medium transition-colors"
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
                className="w-full py-2 bg-gradient-to-r from-[#800000] to-[#8B0000]
                           hover:from-[#8B0000] hover:to-[#700000] text-white font-semibold
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
