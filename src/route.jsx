import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Layout from './layouts/Layout';
import Login from "./pages/Login";
import User from './pages/User';
import RentalManagement from './pages/RentalManagement';
import RoomManagement from './pages/RoomManagement';
import RenterManagement from './pages/RenterManagement';
import UtilitiesCost from './pages/UtilitiesCost';
import Healthdesk from './pages/Healthdesk';
import ChangePassword from './pages/ChangePassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
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
    path: 'change-password',
    element: <ChangePassword />,
  },
  {
    path: "*", // fallback
    element: <Login />,
  }
]);

export default router