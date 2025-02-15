import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup'
import { getError } from '@/lib/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

interface LoginFormValues {
  email: string
  password: string
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const initialValues: LoginFormValues = {
  email: '',
  password: '',
}

const LoginScreen = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }: any = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Card Container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-white text-center">Sign In</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                autoFocus
                className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md 
                           focus:outline-none focus:border-indigo-500"
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
                className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md 
                           focus:outline-none focus:border-indigo-500"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="password" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Login
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Don&apos;t have an account? &nbsp;
                <Link className="text-indigo-400 hover:underline" href={`./signup?redirect=${redirect || '/'}`}>
                  Register
                </Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default LoginScreen
