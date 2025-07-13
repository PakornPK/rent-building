import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Layout from './layouts/Layout';
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // กำหนดให้เส้นทางหลักใช้ Layout
    children: [ 
      {
        index: true, 
        element: <Home />,
      },
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