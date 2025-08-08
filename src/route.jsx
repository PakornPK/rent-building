import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Layout from './layouts/Layout';
import Login from "./pages/Login";
import User from './pages/User';
import RentalManagement from './pages/RentalManagement';
import RoomManagement from './pages/RoomManagement';
import RenterManagement from './pages/RenterManagement';
import RentalView from './pages/RentalView';
import UtilitiesCost from './pages/UtilitiesCost';
import Healthdesk from './pages/Healthdesk';

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
        path: "/rental-management/:rental_id",
        element: <RentalView />
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
      },
      {
        path: "/utilities-cost",
        element: <UtilitiesCost />
      },
      {
        path: "/healthdesk",
        element: <Healthdesk />
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