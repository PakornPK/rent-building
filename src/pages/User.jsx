import { useState, useEffect, useRef } from 'react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import ToggleSwitch from '../components/ToggleSwitch';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user, setUser] = useState({})
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

  const viewDetail = (row) => {
    setUser(row)
    setIsEditModalOpen(true)
  }
  const confirmDelete = (row) => {
    setUser(row)
    setIsConfirmOpen(true)
  }

  const updateUser = async (user) => {
    try {
      const body = {
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        phone: user?.phone,
        organization: user?.organization
      }
      const res = await fetch(`${API_URL}/api/users/${user?.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      // setError(err.message);
    }
  }

  const deleteUser = async (user) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user?.id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      // setError(err.message);
    }
  }
  return (
    <div className='p-4'>
      <div className="container px-4 mx-auto">
        <div className='flex justify-between'>
          <div className='text-4xl p-3'>หน้าจัดการผู้ใช้งาน</div>
          <div className='flex justify-end pb-3 pt-4'>
            <Button
              className="ml-3"
              onClick={() => setIsCreateModalOpen(true)}
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
          onEdit={(row) => viewDetail(row)}
          onDelete={(row) => confirmDelete(row)}
        />

        {/* ส่ง props ทั้งหมดไปให้ Pagination */}
        <Pagination
          totalItems={users.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {isCreateModalOpen && (
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
                onClick={() => setIsCreateModalOpen(false)}
              >
                Submit
              </Button>
              <Button
                className={"w-20 bg-rose-600 hover:bg-rose-700"}
                onClick={() => setIsCreateModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal className="max-w-4xl">
          <div>
            <div className='text-2xl p-4 text-center'>รายละเอียดผู้ใช้งาน</div>
          </div>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                value={user?.first_name || ""}
                onChange={e =>
                  setUser(prev => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
              <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe"
                value={user?.last_name || ""}
                onChange={e =>
                  setUser(prev => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                } />
            </div>
            <div>
              <label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization</label>
              <input type="text" id="organization" disabled class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Flowbite" value={user?.organization} />
            </div>
            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
              <input type="tel" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="012-345-6789" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                value={user?.phone || ""}
                onChange={e =>
                  setUser(prev => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                } />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin</label>
              <ToggleSwitch
                swEnabled={user?.is_admin}
                // handleToggle={() => {
                //   if (!user) return
                //   setUser(prev => ({ ...prev, is_admin: !prev.is_admin }))
                // }}
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Active</label>
              <ToggleSwitch
                swEnabled={user?.is_active}
                // handleToggle={() => {
                //   if (!user) return
                //   setUser(prev => ({ ...prev, is_active: !prev.is_active }))
                // }}
              />
            </div>
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com"
              value={user?.email || ""}
              onChange={e =>
                setUser(prev => ({
                  ...prev,
                  email: e.target.value,
                }))
              } />
          </div>
          <div className='flex justify-end gap-3'>
            <Button
              className={"w-35"}
              onClick={async () => await updateUser(user)}
            >
              Update
            </Button>
            <Button
              className={"w-35 bg-rose-600 hover:bg-rose-700"}
              onClick={() => setIsEditModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}

      {isConfirmOpen && (
        <Modal className="max-w-xs">
          <div>
            <div className='text-xl p-4 text-center'>Confirm delete?</div>
          </div>
          <div className='flex justify-center gap-3'>
            <Button
              className={"w-25 bg-rose-600 hover:bg-rose-700"}
              onClick={async () => await deleteUser(user)}
            >
              Delete
            </Button>
            <Button
              className={"w-25"}
              onClick={() => setIsConfirmOpen(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default User