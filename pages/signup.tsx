import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup'
import { getError } from '@/lib/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'

interface SignupFormValues {
  name: string
  email: string
  password: string
  confirmpassword: string
}

const validationSchema = Yup.object({
  name: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmpassword: Yup.string()
    .min(6, 'Confirm Password must be at least 6 characters')
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})

const initialValues: SignupFormValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
}

const RegisterScreen = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }: any = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const handleSubmit = async ({ name, email, password }: SignupFormValues) => {
    try {
      await axios.post('/api/auth/signup', { name, email, password })

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
        <h1 className="text-2xl font-semibold text-white text-center">Sign Up</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">
                Username
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                autoFocus
                className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md 
                           focus:outline-none focus:border-indigo-500"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="name" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <Field
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md 
                           focus:outline-none focus:border-indigo-500"
              />
              <div className="text-red-500 text-sm mt-1">
                <ErrorMessage name="confirmpassword" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default RegisterScreen
