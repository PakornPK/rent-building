import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Layout from './layouts/Layout';
import Login from "./pages/Login";
import User from './pages/User';

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