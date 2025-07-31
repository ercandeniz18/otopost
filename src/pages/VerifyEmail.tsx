import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        toast.error('Invalid verification link');
        navigate('/login');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        toast.success('Email verified successfully! You can now log in.');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to verify email. The link may be expired or invalid.');
        navigate('/login');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {verifying ? 'Verifying your email...' : 'Email Verification'}
          </h2>
          {verifying && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 