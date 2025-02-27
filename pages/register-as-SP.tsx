/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface SPFormValues {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
  phone: string;
  about: string;
  skills: string;
  servicePincodes: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(1, "Username must be at least 1 character")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  about: Yup.string().required("About is required"),
  skills: Yup.string().required("Skills are required"),
  servicePincodes: Yup.string()
    .required("Service pincodes are required")
    .test("valid-pincodes", "Invalid pincodes format", (value) => {
      return value
        ? value.split(",").every((pincode) => /^[0-9]{6}$/.test(pincode.trim()))
        : false;
    }),
});

const initialValues: SPFormValues = {
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
  phone: "",
  about: "",
  skills: "",
  servicePincodes: "",
};

const RegisterAsSP = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const handleSubmit = async (values: SPFormValues) => {
    try {
      await axios.post("/api/auth/signup-sp", {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        about: values.about,
        skills: values.skills.split(",").map((s) => s.trim()),
        servicePincodes: values.servicePincodes.split(",").map((p) => p.trim()),
      });
      toast.success(
        "Thank you for registering, the Helper Buddy team will reach out to you shortly!",
        {
          autoClose: 4000,
          style: { backgroundColor: "#800000", color: "#fff" },
        }
      );
      setTimeout(() => {
        router.push("/");
      }, 4000);
    } catch (err: unknown) {
      let errorMsg = "Registration failed";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, {
        autoClose: 3000,
        style: { backgroundColor: "#800000", color: "#fff" },
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] overflow-x-hidden px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="p-6 sm:p-8 space-y-6 bg-[#1a1a1a] rounded-md shadow-md">
          {/* Header with Options */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
            <div className="flex justify-center mt-6 pt-4 space-x-8">
              <Link
                href={`/signup?redirect=${redirect || "/"}`}
                className="text-gray-600 hover:text-gray-300 font-medium"
              >
                As User
              </Link>
              <span className="text-white font-medium">As Service Provider</span>
            </div>
            <hr className="mt-4 border-gray-600" />
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">
                  Username
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <Field
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="confirmpassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-200">
                  Phone Number
                </label>
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* About */}
              <div>
                <label htmlFor="about" className="block mb-2 text-sm font-medium text-gray-200">
                  About
                </label>
                <Field
                  as="textarea"
                  id="about"
                  name="about"
                  placeholder="Tell us about yourself"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <ErrorMessage name="about" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-200">
                  Skills
                </label>
                <Field
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="e.g., plumbing, carpentry, painting"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <div className="text-gray-400 text-sm mt-1">
                  Enter comma-separated skills
                </div>
                <ErrorMessage name="skills" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Service Pincodes */}
              <div>
                <label htmlFor="servicePincodes" className="block mb-2 text-sm font-medium text-gray-200">
                  Serviceable Pincodes
                </label>
                <Field
                  id="servicePincodes"
                  name="servicePincodes"
                  type="text"
                  placeholder="e.g., 395007, 395003, 395006"
                  className="w-full p-2 bg-[#2c2c2c] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:border-[#800000]"
                />
                <div className="text-gray-400 text-sm mt-1">
                  Enter comma-separated pincodes
                </div>
                <ErrorMessage name="servicePincodes" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-[#800000] to-[#8B0000] hover:from-[#8B0000] hover:to-[#700000] text-white font-semibold rounded-md transition-colors"
              >
                Register as Service Provider
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account? &nbsp;
                  <Link
                    className="text-[#800000] hover:underline"
                    href={`/login?redirect=${redirect || "/"}`}
                  >
                    Login
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

export default RegisterAsSP;
