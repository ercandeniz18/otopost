import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Phone } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { sendVerificationCode, verifyCode as verifyVerificationCode } from '../utils/emailVerification';

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  type: 'email' | 'phone';
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({ isOpen, onClose, onVerify, type }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please enter the 6-digit code sent to your {type === 'email' ? 'email' : 'phone'}
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          maxLength={6}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onVerify(code)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [username, setUsername] = useState('');
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email');
  const [showVerification, setShowVerification] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string): PasswordStrength => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const isPasswordStrong = (strength: PasswordStrength): boolean => {
    return Object.values(strength).every(Boolean);
  };

  const handleSignup = async () => {
    try {
      if (password !== passwordRepeat) {
        toast.error('Passwords do not match');
        return;
      }

      const passwordStrength = checkPasswordStrength(password);
      if (!isPasswordStrong(passwordStrength)) {
        toast.error('Password does not meet the requirements');
        return;
      }

      // Send verification code
      const value = verificationType === 'email' ? email : phone;
      await sendVerificationCode(verificationType, value);
      setShowVerification(true);
      toast.success(`Verification code has been sent to your ${verificationType}`);
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Implement Google OAuth
      // This would redirect to Google's OAuth page
      window.location.href = '/auth/google';
    } catch (error) {
      toast.error('Google signup failed. Please try again.');
    }
  };

  const handleVerification = async (code: string) => {
    try {
      const contactValue = verificationType === 'email' ? email : phone;
      const isValid = await verifyVerificationCode(contactValue, code);
      if (isValid) {
        setShowVerification(false);
        toast.success('Verification successful! You can now login.');
        navigate('/login');
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setVerificationType('email')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  verificationType === 'email'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <Mail className="h-5 w-5 mx-auto" />
                <span className="text-sm mt-1">Email</span>
              </button>
              <button
                onClick={() => setVerificationType('phone')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  verificationType === 'phone'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <Phone className="h-5 w-5 mx-auto" />
                <span className="text-sm mt-1">Phone</span>
              </button>
            </div>

            {verificationType === 'email' ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowPasswordRequirements(true);
                }}
              />
            </div>

            <div>
              <label htmlFor="passwordRepeat" className="sr-only">
                Repeat Password
              </label>
              <input
                id="passwordRepeat"
                name="passwordRepeat"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                placeholder="Repeat Password"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            </div>

            {showPasswordRequirements && (
              <div className="mt-4 text-sm">
                <h3 className="font-medium text-gray-900 dark:text-white">Password requirements:</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <li className={password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>
                    At least one uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>
                    At least one lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>
                    At least one number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}>
                    At least one special character (!@#$%^&*(),.?":{'{'}|&lt;&gt;)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>

      {showVerification && (
        <VerificationPopup
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          onVerify={handleVerification}
          type={verificationType}
        />
      )}
    </div>
  );
};

export default SignUp; 