import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Layout from './layouts/Layout';
import Login from "./pages/Login";
import User from './pages/User';
import RentalManagement from './pages/RentalManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // กำหนดให้เส้นทางหลักใช้ Layout
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/rental-management",
        element: <RentalManagement />
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