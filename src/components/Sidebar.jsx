import { useState } from 'react';
import {
  HomeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom'; // เปลี่ยนจาก 'react-router' เป็น 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button (hidden on larger screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out z-40`}
      >
        <h2 className="text-2xl font-semibold mb-6">Rent Building</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                หน้าแรก
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <UserIcon className="h-5 w-5 mr-3" />
                จัดการผู้ใช้
              </NavLink>
            </li>
            <li className='mb-4'>
              <NavLink
                to="/rental-management"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <ClipboardDocumentListIcon className='h-5 w-5 mr-3' />
                จัดการรายการใช้เช่า
              </NavLink>
            </li>
            <li className='mb-4'>
              <NavLink
                to="/room-management"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <BuildingOffice2Icon className='h-5 w-5 mr-3' />
                หน้าจัดการห้องเช่า
              </NavLink>
            </li>
            <li className='mb-4'>
              <NavLink
                to="/renter-management"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <UserCircleIcon className='h-5 w-5 mr-3' />
                จัดการผู้เช่า
              </NavLink>
            </li>
            <li className='mb-4'>
              <NavLink
                to="/utilities-cost"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <BoltIcon className='h-5 w-5 mr-3' />
                ค่าน้ำค่าไฟ
              </NavLink>
            </li>
            <li className='mb-4'>
              <NavLink
                to="/healthdesk"
                className={({ isActive }) =>
                  `flex items-center text-lg ${isActive ? 'text-blue-400' : 'hover:text-blue-400'}`
                }
              >
                <WrenchScrewdriverIcon className='h-5 w-5 mr-3' />
                แจ้งซ่อม
              </NavLink>
            </li>
          </ul>
          <ul className='absolute bottom-0'>
            <li className='mb-4' onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}>
              <div className='flex items-center text-lg hover:text-blue-400'>
                <ArrowLeftStartOnRectangleIcon className='h-5 w-5 mr-3' />
                Logout
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile (when sidebar is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;