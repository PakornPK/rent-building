import React from 'react';

const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // ถ้ามีหน้าเดียวก็นำ Pagination ออกไป
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <nav className="flex items-center justify-center p-4">
      <ul className="flex list-style-none">
        <li className={`mx-1 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 text-sm text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            ก่อนหน้า
          </button>
        </li>

        {getPageNumbers().map((page) => (
          <li key={page} className="mx-1">
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm transition duration-150 ease-in-out rounded-md
                ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={`mx-1 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 text-sm text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            ถัดไป
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;