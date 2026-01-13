import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance, { endpoints } from '@/helper/axios';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and state from URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Retrieve stored platform and state from sessionStorage
        const storedPlatform = sessionStorage.getItem('oauth_platform');
        const storedState = sessionStorage.getItem('oauth_state');

        // Check for OAuth errors
        if (error) {
          const errorMsg = `Authorization failed: ${errorDescription || error}`;
          setStatus('error');
          setMessage(errorMsg);
          // Clean up sessionStorage
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_platform');

          // Notify parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth_error', message: errorMsg }, window.location.origin);
            setTimeout(() => window.close(), 2000);
          } else {
            setTimeout(() => navigate('/connections'), 3000);
          }
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          const errorMsg = 'Invalid callback parameters: Missing code or state';
          setStatus('error');
          setMessage(errorMsg);
          // Clean up sessionStorage
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_platform');

          // Notify parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth_error', message: errorMsg }, window.location.origin);
            setTimeout(() => window.close(), 2000);
          } else {
            setTimeout(() => navigate('/connections'), 3000);
          }
          return;
        }

        // Optional: Verify state matches stored state (CSRF protection)
        if (storedState && state !== storedState) {
          const errorMsg = 'State mismatch - possible CSRF attack';
          setStatus('error');
          setMessage(errorMsg);
          // Clean up sessionStorage
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_platform');

          // Notify parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth_error', message: errorMsg }, window.location.origin);
            setTimeout(() => window.close(), 2000);
          } else {
            setTimeout(() => navigate('/connections'), 3000);
          }
          return;
        }

        // Prepare callback payload
        // The state is base64 encoded and contains code_verifier for PKCE
        // Backend will decode and extract it automatically
        const payload = {
          code,
          state, // Send state exactly as received (base64 encoded, contains code_verifier)
        };

        // Send the authorization code to backend
        const response = await axiosInstance.post(endpoints.connections.callback, payload);

        // Clean up sessionStorage after successful callback
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_platform');

        if (response.data.statusCode === 200) {
          setStatus('success');
          setMessage(`Successfully connected ${storedPlatform || 'account'}!`);

          // Notify parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage(
              { type: 'oauth_success', platform: storedPlatform },
              window.location.origin
            );
            // Close popup after short delay
            setTimeout(() => window.close(), 1500);
          } else {
            // Not a popup, navigate normally
            setTimeout(() => navigate('/connections'), 2000);
          }
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Failed to connect account');
          // Clean up sessionStorage on failure
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_platform');

          // Notify parent window if this is a popup
          if (window.opener) {
            window.opener.postMessage(
              { type: 'oauth_error', message: response.data.message },
              window.location.origin
            );
            setTimeout(() => window.close(), 2000);
          } else {
            setTimeout(() => navigate('/connections'), 3000);
          }
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage =
          error?.response?.data?.message || error?.message || 'An error occurred while connecting';
        setStatus('error');
        setMessage(errorMessage);
        // Clean up sessionStorage on error
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_platform');

        // Notify parent window if this is a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'oauth_error', message: errorMessage }, window.location.origin);
          setTimeout(() => window.close(), 2000);
        } else {
          setTimeout(() => navigate('/connections'), 3000);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'Connecting...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Connection Failed'}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Progress indicator for loading state */}
          {status === 'loading' && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full animate-progress"></div>
            </div>
          )}

          {/* Redirect message */}
          {status !== 'loading' && (
            <p className="text-sm text-gray-500">Redirecting to connections page...</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
