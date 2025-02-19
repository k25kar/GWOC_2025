import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values: { email: string }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", values);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-xl shadow-2xl">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your email address to receive a password reset link
          </p>
        </div>

        {/* Form Section */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-2">
                {/* Email Input */}
                <div className="relative group">
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                             transition duration-200 ease-in-out placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                  {/* Error Message */}
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1 ml-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-white
                         bg-zinc-700 hover:bg-zinc-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition duration-200 ease-in-out
                         text-sm font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm text-gray-400 hover:text-white transition duration-200 ease-in-out"
                >
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
