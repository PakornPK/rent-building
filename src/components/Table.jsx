import React from 'react';

const Table = ({ data, columns, pageSize, currentPage }) => {
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data?.slice(startIndex, startIndex + pageSize) || [];

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;