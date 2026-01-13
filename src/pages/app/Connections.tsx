import axiosInstance, { endpoints } from '@/helper/axios';
import { useState, useEffect } from 'react';

interface Connection {
  id: string;
  platform: string;
  accountName: string;
  accountHandle: string;
  status: 'active' | 'disconnected' | 'pending';
  connectedAt: string;
  followers: string;
  logo: JSX.Element;
  color: string;
}

const platformLogos = {
  facebook: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  twitter: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  youtube: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

const mockConnections: Connection[] = [
  {
    id: '1',
    platform: 'Facebook',
    accountName: 'John Doe',
    accountHandle: '@johndoe',
    status: 'active',
    connectedAt: '2024-01-15',
    followers: '12.5K',
    logo: platformLogos.facebook,
    color: '#1877F2',
  },
  {
    id: '2',
    platform: 'Instagram',
    accountName: 'johndoe_official',
    accountHandle: '@johndoe_official',
    status: 'active',
    connectedAt: '2024-01-20',
    followers: '45.2K',
    logo: platformLogos.instagram,
    color: '#E4405F',
  },
  {
    id: '3',
    platform: 'Twitter',
    accountName: 'John Doe',
    accountHandle: '@john_doe',
    status: 'disconnected',
    connectedAt: '2024-01-10',
    followers: '8.3K',
    logo: platformLogos.twitter,
    color: '#000000',
  },
];

const availablePlatforms = [
  { name: 'Facebook', logo: platformLogos.facebook, color: '#1877F2' },
  { name: 'Instagram', logo: platformLogos.instagram, color: '#E4405F' },
  { name: 'Twitter', logo: platformLogos.twitter, color: '#000000' },
  { name: 'LinkedIn', logo: platformLogos.linkedin, color: '#0A66C2' },
  { name: 'YouTube', logo: platformLogos.youtube, color: '#FF0000' },
  { name: 'TikTok', logo: platformLogos.tiktok, color: '#000000' },
];

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [showModal, setShowModal] = useState(false);

  // Listen for messages from OAuth popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Verify message origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, platform, message } = event.data;

      if (type === 'oauth_success') {
        // Show success notification
        alert(`Successfully connected ${platform}!`);
        // Optionally refresh connections list here
        // fetchConnections();
      } else if (type === 'oauth_error') {
        alert(`Failed to connect: ${message}`);
      }
    };

    // Listen for messages from OAuth popup
    window.addEventListener('message', handleOAuthMessage);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  const handleConnect = async (platformName: string) => {
    try {
      const response = await axiosInstance.get(endpoints.connections.getUrl(platformName.toLowerCase()));
      const { url, pkce } = response.data.data;

      // Store platform name for later use
      sessionStorage.setItem('oauth_platform', platformName.toLowerCase());

      // Store state from URL for verification (optional but recommended)
      const urlObj = new URL(url);
      const state = urlObj.searchParams.get('state');
      if (state) {
        sessionStorage.setItem('oauth_state', state);
      }

      // Note: PKCE code_verifier is already embedded in the state parameter (base64 encoded)
      // No need to store it separately - backend will extract it from state

      // Open OAuth authorization URL in popup
      if (url) {
        const width = 550;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
          url,
          'oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no`
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error fetching connection URL:', error);
      // Show error to user
      alert('Failed to start OAuth flow. Please try again.');
    }
  };

  const handleDisconnect = (connectionId: string) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId ? { ...conn, status: 'disconnected' as const } : conn
      )
    );
  };

  const handleReconnect = (connectionId: string) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId ? { ...conn, status: 'active' as const } : conn
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
          <p className="text-gray-600 mt-1">Manage your social media connections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Connection
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Connections</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{connections.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {connections.filter((c) => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disconnected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {connections.filter((c) => c.status === 'disconnected').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
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
          </div>
        </div>
      </div>

      {/* Connections List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Connections</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: connection.color }}
                  >
                    {connection.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {connection.platform}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {connection.accountName} · {connection.accountHandle}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Connected on {new Date(connection.connectedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {connection.followers}
                    </p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        connection.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : connection.status === 'disconnected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {connection.status.charAt(0).toUpperCase() +
                        connection.status.slice(1)}
                    </span>

                    {connection.status === 'active' ? (
                      <button
                        onClick={() => handleDisconnect(connection.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReconnect(connection.id)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Reconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Connection</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Choose a platform to connect your account
            </p>

            <div className="grid grid-cols-2 gap-4">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleConnect(platform.name)}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.logo}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {platform.name}
                    </p>
                    <p className="text-sm text-gray-500">Connect account</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
