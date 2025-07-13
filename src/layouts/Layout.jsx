import Sidebar from '../components/Sidebar'; // ตรวจสอบ Path ให้ถูกต้อง
import { Outlet } from 'react-router-dom'; // <== ตัวนี้สำคัญมาก!

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;