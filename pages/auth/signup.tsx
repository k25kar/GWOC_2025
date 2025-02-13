import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

enum SignupStep {
  ROLE_SELECTION,
  USER_DETAILS,
  PROVIDER_DETAILS,
  OTP_VERIFICATION
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>(SignupStep.ROLE_SELECTION);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    pincode: '',
    area: '',
    serviceType: '',
    servicePincodes: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServicePincodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      servicePincodes: e.target.value.split(',').map(p => p.trim()),
    });
  };

  const validateUserDetails = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.pincode || !formData.area) {
      toast.error('All fields are required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Invalid phone number');
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error('Invalid pincode');
      return false;
    }
    return true;
  };

  const validateProviderDetails = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.serviceType || formData.servicePincodes.length === 0) {
      toast.error('All fields are required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Invalid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signup', formData);
      if (response.data.success) {
        setStep(SignupStep.OTP_VERIFICATION);
        toast.success('Signup successful! Please verify OTP');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Signup failed');
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
        otp,
      });
      if (response.data.success) {
        toast.success('OTP verified successfully!');
        router.push('/auth/login');
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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === SignupStep.ROLE_SELECTION && (
          <div className="text-center">
            <h1 className="text-2xl mb-8 font-bold">Sign up as:</h1>
            <button 
              onClick={() => {
                setFormData({...formData, role: 'user'});
                setStep(SignupStep.USER_DETAILS);
              }}
              className="border-white border-2 px-8 py-3 block w-full mb-4 hover:bg-white hover:text-black transition-colors"
            >
              User
            </button>
            <button
              onClick={() => {
                setFormData({...formData, role: 'provider'});
                setStep(SignupStep.PROVIDER_DETAILS);
              }}
              className="border-white border-2 px-8 py-3 block w-full hover:bg-white hover:text-black transition-colors"
            >
              Service Provider
            </button>
          </div>
        )}

        {step === SignupStep.USER_DETAILS && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">User Registration</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
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
            <input
              type="text"
              name="area"
              placeholder="Area of Residence"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <button
              onClick={() => validateUserDetails() && handleSubmit()}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </div>
        )}

        {step === SignupStep.PROVIDER_DETAILS && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">Service Provider Registration</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
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
            <input
              type="text"
              name="serviceType"
              placeholder="Service Type (e.g., Plumbing, AC Repair)"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="servicePincodes"
              placeholder="Service Pincodes (comma separated)"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none"
              onChange={handleServicePincodesChange}
            />
            <button
              onClick={() => validateProviderDetails() && handleSubmit()}
              disabled={loading}
              className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </div>
        )}

        {step === SignupStep.OTP_VERIFICATION && (
          <div className="space-y-4">
            <h2 className="text-2xl mb-6 font-bold text-center">OTP Verification</h2>
            <p className="text-center mb-4">
              We've sent an OTP to {formData.phone} and {formData.email}
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 bg-transparent border-2 border-white rounded-none text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
      </div>
    </div>
  );
}