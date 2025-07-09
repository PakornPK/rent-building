import { createBrowserRouter } from 'react-router'
import Home from "./pages/Home";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "*", // fallback
    element: <Home/>,
  },
]);

export default router