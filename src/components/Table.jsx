import { DocumentMagnifyingGlassIcon, TrashIcon } from '@heroicons/react/16/solid';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import React from 'react';

const Table = ({ data, columns, pageSize, currentPage, onView, onEdit, onDelete }) => {
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data?.slice(startIndex, startIndex + pageSize) || [];
  const isView = onView || false
  const isEdit = onEdit || false
  const isDelete = onDelete || false
  const isAction = isView || isEdit || isDelete
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500">
        {/* ส่วนหัวของตาราง */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {column.header}
              </th>
            ))}
            {isAction && (
              <th>
                Action
              </th>
            )}
          </tr>
        </thead>
        {/* ส่วนข้อมูล */}
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {/* เข้าถึงข้อมูลจาก key ที่เรากำหนดไว้ใน props 'accessor' */}
                  {row[column.accessor]}
                </td>
              ))}
              {isAction && (
                <td>
                  {isView && (
                    <button
                      onClick={() => onView(row)}
                    >
                      <DocumentMagnifyingGlassIcon className='h-5 w-5 mr-3 hover:bg-blue-600 rounded hover:text-white' />
                    </button>
                  )}
                  {isEdit && (
                    <button
                      onClick={() => onEdit(row)}
                    >
                      <PencilSquareIcon className='h-5 w-5 mr-3 hover:bg-blue-600 rounded hover:text-white' />
                    </button>
                  )}
                  {isDelete && (
                    <button
                      onClick={() => onDelete(row)}
                    >
                      <TrashIcon className='h-5 w-5 mr-3 hover:bg-blue-600 rounded hover:text-white' />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;