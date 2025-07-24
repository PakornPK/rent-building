import { useState } from 'react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className='p-4'>
      <div className="container px-4 mx-auto">
        <div className='flex justify-between'>
          <div className='text-4xl p-3'>หน้าจัดการผู้ใช้งาน</div>
          <div className='flex justify-end pb-3 pt-4'>
            <Button
              className="ml-3"
              onClick={() => setIsModalOpen(true)}
            >
              เพิ่มผู้ใช้งาน
            </Button>
          </div>
        </div>
      </div>
      <div className="container p-4 mx-auto mt-8">
        <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลผู้ใช้งาน</h1>

        {/* ส่ง props ทั้งหมดไปให้ Table */}
        <Table
          data={DUMMY_DATA}
          columns={COLUMNS}
          pageSize={pageSize}
          currentPage={currentPage}
          onView={(row) => console.log(row.id)}
          onEdit={(row) => console.log(row.id)}
          onDelete={(row) => console.log(row.id)}
        />

        {/* ส่ง props ทั้งหมดไปให้ Pagination */}
        <Pagination
          totalItems={DUMMY_DATA.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {isModalOpen && (
        <Modal className="max-w-4xl">
          <div className='flex flex-col gap-3'>
            <div className='text-2xl p-4 text-center'>เพิ่มห้องเช่า</div>
            <div className='flex bg-neutral-200 p-3 gap-3 rounded-lg'>
              <div className='flex-1 border-r-1'>
                <label>Upload File (*.csv)</label>
                <div className='pr-3 pt-3'>
                  <UploadFile />
                </div>
              </div>
              <div className='flex-1'>
                <label>Download Example File</label>
                <div className='text-center pt-2'>
                  <Button>Download</Button>
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                className={"w-20"}
                onClick={() => setIsModalOpen(false)}
              >
                Submit
              </Button>
              <Button
                className={"w-20 bg-rose-600 hover:bg-rose-700"}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default User