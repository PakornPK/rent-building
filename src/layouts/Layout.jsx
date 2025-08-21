import Sidebar from '../components/Sidebar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
    useAuth();
    const token = localStorage.getItem("access_token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Sidebar />
            <main className='pl-64 p-4'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;