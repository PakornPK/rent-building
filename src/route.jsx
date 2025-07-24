import { createBrowserRouter } from 'react-router'
import Dashboard from "./pages/Dashboard";
import Layout from './layouts/Layout';
import Login from "./pages/Login";
import User from './pages/User';
import RentalManagement from './pages/RentalManagement';
import RoomManagement from './pages/RoomManagement';
import RenterManagement from './pages/RenterManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // กำหนดให้เส้นทางหลักใช้ Layout
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/rental-management",
        element: <RentalManagement />
      },
      {
        path: "/room-management",
        element: <RoomManagement />
      },
      {
        path: "/renter-management",
        element: <RenterManagement />
      },
      {
        path: "/user",
        element: <User />
      }
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: "*", // fallback
    element: <Login />,
  }
]);

export default router