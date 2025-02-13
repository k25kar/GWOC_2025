import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

enum LoginStep {
  ROLE_SELECTION,
  LOGIN_DETAILS,
  FORGOT_PASSWORD,
  OTP_VERIFICATION,
  RESET_PASSWORD
}

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>(LoginStep.ROLE_SELECTION);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    phone: '',
    password: '',
    newPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateLoginDetails = () => {
    if ((!formData.email && !formData.phone) || !formData.password) {
      toast.error('Email/Phone and password are required');
      return false;
    }
    return true;
  };

  const validateForgotPassword = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        setStep(LoginStep.OTP_VERIFICATION);
        toast.success('OTP sent to your registered email');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: formData.email
      });

      if (response.data.success) {
        setStep(LoginStep.OTP_VERIFICATION);
        toast.success('OTP sent to your email');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Password reset failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: formData.email,
        otp
      });

      if (response.data.success) {
        if (step === LoginStep.OTP_VERIFICATION) {
          setStep(LoginStep.RESET_PASSWORD);
          toast.success('OTP verified');
        } else {
          await handlePostLogin();
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'OTP verification failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email: formData.email,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully');
        router.push('/auth/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Password reset failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostLogin = async () => {
    try {
      // Implement your actual login logic with JWT token handling
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === LoginStep.ROLE_SELECTION && (
          <div className="text-center">
            <h1 className="text-2xl mb-8 font-bold">Login as:</h1>
            <button 
              onClick={() => {
                setFormData({...formData, role: 'user'});
                setStep(LoginStep.LOGIN_DETAILS);
              }}
              className="border-white border-2 px-8 py-3 block w-full mb-4 hover:bg-white hover:text-black transition-colors"
            >
              User
            </button>
            <button
              onClick={() => {
                setFormData({...formData, role: 'provider'});
                setStep(LoginStep.LOGIN_DETAILS);
              }}
              className="border-white border-2 px-8 py-3 block w-full hover:bg-white hover:text-black transition-colors"
            >
              Service Provider
            </button>
            <div className="mt-4">
              <Link href="/auth/signup" className="text-gray-400 hover:text-white">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        )}

        {step === LoginStep.LOGIN_DETAILS && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">Login</h2>
            <input
              type="text"
              name="email"
              placeholder="Email or Phone Number"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <button
              onClick={() => validateLoginDetails() && handleLogin()}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              onClick={() => setStep(LoginStep.FORGOT_PASSWORD)}
              className="text-gray-400 hover:text-white w-full text-left"
            >
              Forgot Password?
            </button>
            <button
              onClick={() => setStep(LoginStep.ROLE_SELECTION)}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
          </div>
        )}

        {step === LoginStep.FORGOT_PASSWORD && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">Forgot Password</h2>
            <input
              type="email"
              name="email"
              placeholder="Registered Email"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <button
              onClick={() => validateForgotPassword() && handleForgotPassword()}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              onClick={() => setStep(LoginStep.LOGIN_DETAILS)}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Login
            </button>
          </div>
        )}

        {step === LoginStep.OTP_VERIFICATION && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">OTP Verification</h2>
            <p className="text-center mb-4">
              OTP sent to {formData.email}
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {step === LoginStep.RESET_PASSWORD && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">Reset Password</h2>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}