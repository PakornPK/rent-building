import Sidebar from '../components/Sidebar'; // ตรวจสอบ Path ให้ถูกต้อง
import { Outlet } from 'react-router-dom'; // <== ตัวนี้สำคัญมาก!

const Layout = () => {
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Sidebar />

            {/* เพิ่ม class 'pl-64' ที่นี่ */}
            <main className='pl-64 p-4'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;