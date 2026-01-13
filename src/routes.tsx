import { createBrowserRouter } from 'react-router-dom';
import Layout from './ui/Layout';
import Dashboard from './pages/app/Dashboard';
import Projects from './pages/app/Projects';
import Analytics from './pages/app/Analytics';
import Team from './pages/app/Team';
import Settings from './pages/app/Settings';
import Connections from './pages/app/Connections';
import Scheduler from './pages/app/Scheduler';
import OAuthCallback from './pages/app/OAuthCallback';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import NotFoundPage from './pages/public/NotFound';



export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallback />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'team',
        element: <Team />,
      },
      {
        path: 'connections',
        element: <Connections />,
      },
      {
        path: 'scheduler',
        element: <Scheduler />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
