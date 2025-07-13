import { useState } from 'react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

const DUMMY_DATA = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `ผู้ใช้งานคนที่ ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 2 === 0 ? 'Admin' : 'User',
}));

// กำหนด Columns สำหรับตาราง
const COLUMNS = [
    { header: 'ID', accessor: 'id' },
    { header: 'ชื่อ', accessor: 'name' },
    { header: 'อีเมล', accessor: 'email' },
    { header: 'บทบาท', accessor: 'role' },
];

const pageSize = 10; // จำนวนข้อมูลต่อหน้า

function User() {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
   return (
    <div className="container p-4 mx-auto mt-8">
      <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลผู้ใช้งาน</h1>
      
      {/* ส่ง props ทั้งหมดไปให้ Table */}
      <Table 
        data={DUMMY_DATA} 
        columns={COLUMNS} 
        pageSize={pageSize} 
        currentPage={currentPage} 
      />
      
      {/* ส่ง props ทั้งหมดไปให้ Pagination */}
      <Pagination
        totalItems={DUMMY_DATA.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default User