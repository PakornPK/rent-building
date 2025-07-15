import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
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