import { useState } from 'react';
import { HomeIcon, UserIcon, CogIcon, ClipboardDocumentListIcon, BuildingOffice2Icon, UserCircleIcon } from '@heroicons/react/24/solid'; // Example icons
import { Link } from 'react-router';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile toggle

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
              <Link to="/" className="flex items-center text-lg hover:text-blue-400">
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/user" className="flex items-center text-lg hover:text-blue-400">
                <UserIcon className="h-5 w-5 mr-3" />
                Users
              </Link>
            </li>
            <li className='mb-4'>
              <Link to="/rental-management" className='flex items-center text-lg hover:text-blue-400'>
                <ClipboardDocumentListIcon className='h-5 w-5 mr-3' />
                Rental Management
              </Link>
            </li>
            <li className='mb-4'>
              <Link to="/room-management" className='flex items-center text-lg hover:text-blue-400'>
                <BuildingOffice2Icon className='h-5 w-5 mr-3' />
                Room Management
              </Link>
            </li>
            <li className='mb-4'>
              <Link to="/renter-management" className='flex items-center text-lg hover:text-blue-400'>
                <UserCircleIcon className='h-5 w-5 mr-3' />
                Renter Management
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/setting" className="flex items-center text-lg hover:text-blue-400">
                <CogIcon className="h-5 w-5 mr-3" />
                Settings
              </Link>
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