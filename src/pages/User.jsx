import { useState,useEffect,useRef } from 'react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';

// กำหนด Columns สำหรับตาราง
const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'ชื่อ', accessor: 'first_name' },
  { header: 'นามสกุล', accessor: 'last_name' },
  { header: 'อีเมล', accessor: 'email' },
  { header: 'โทรศัพท์', accessor: 'phone' },
  { header: 'active', accessor: 'is_active' },
  { header: 'admin', accessor: 'is_admin' },
  { header: 'เข้าระบบล่าสุด', accessor: 'last_login' },
];

const API_URL = import.meta.env.VITE_API_URL;

const pageSize = 10; // จำนวนข้อมูลต่อหน้า

function User() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const fetched = useRef(false);
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users?page=${currentPage}&page_size=${pageSize}&sort=ASC`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data?.data);    
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchUsers();
    }
  }, []);

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
          data={users}
          columns={columns}
          pageSize={pageSize}
          currentPage={currentPage}
          onView={(row) => console.log(row.id)}
          onEdit={(row) => console.log(row.id)}
          onDelete={(row) => console.log(row.id)}
        />

        {/* ส่ง props ทั้งหมดไปให้ Pagination */}
        <Pagination
          totalItems={users.length}
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