import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const code = searchParams.get('code');
        
        // If there's no code, we need to initiate the OAuth flow
        if (!code) {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          const redirectUri = `${window.location.origin}/auth/google`;
          const scope = 'email profile';
          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
          
          console.log('Initiating Google OAuth flow...');
          window.location.href = authUrl;
          return;
        }

        console.log('Received authorization code, exchanging for tokens...');
        
        // Exchange the code for tokens
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
            redirect_uri: `${window.location.origin}/auth/google`,
            grant_type: 'authorization_code'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Google auth error details:', errorData);
          throw new Error(errorData.message || 'Failed to authenticate with Google');
        }

        const data = await response.json();
        console.log('Successfully authenticated with Google');
        
        // Store the token and user data
        localStorage.setItem('token', data.token);
        await login(data.user.email, data.token);

        toast.success('Successfully logged in with Google');
        navigate('/dashboard');
      } catch (error) {
        console.error('Google authentication error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to authenticate with Google');
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Authenticating with Google...</p>
      </div>
    </div>
  );
};

export default GoogleAuth; 