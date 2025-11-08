import React, { useCallback, useRef, useState, useEffect } from 'react';
import Table from '../components/Table';
import Pagination from '@mui/material/Pagination';
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import tenantsProxy from '../proxy/tenants';
import roomProxy from '../proxy/rooms';
import { BanknotesIcon } from '@heroicons/react/24/outline';

// กำหนด Columns สำหรับตาราง
const COLUMNS = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'ชื่อ', flex: 1 },
    { field: 'email', headerName: 'อีเมล', flex: 1 },
    { field: 'phone', headerName: 'เบอร์โทรศัพท์', flex: 1 },
    { field: 'status', headerName: 'สถานะ', flex: 1 },
];

const pageSize = 10; // จำนวนข้อมูลต่อหน้า

function TenantsManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [totalItems, setTotalItems] = useState(0);
    const [roomList, setRoomList] = useState([])
    const [roomTenants, setRoomTenants] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [tenants, setTenants] = useState([]);
    const [item, setItem] = useState({});

    const fetched = useRef(false);

    const fetchTenants = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await tenantsProxy.getTenants(page, pageSize, 'ASC');
            if (!res?.ok) {
                throw new Error('Failed to fetch tenants');
            }
            const data = await res.json();
            setTenants(data.data);
            setTotalItems(data.total_rows);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    const fetchVacant = useCallback(async () => { 
        try {
            const res = await roomProxy.getRoomVacant()
            if (!res?.ok) {
                throw new Error('Failed to room vacant');
            }
            const data = await res.json()
            setRoomList(data?.data)
        } catch (error) {
            console.error('fetchVacant: ', error)
        }
    },[])

    const handleSubmitCreateTenent = async () => {
        try {
            const res = await tenantsProxy.createTenant([item])
            if (!res?.ok) {
                throw new Error('Failed create tenant')
            }
            fetchTenants()
            handleCloseModal()
        } catch (error) {
            console.error('handleSubmitCreateTenent: ', error)
        }
    }

    const handleChangeRoom = async (trageID) => {
        try {
            const res = await roomProxy.swapRoom(item.id,roomTenants?.id || 0 ,trageID)
             if (!res?.ok) {
                throw new Error('Failed swap room')
            }
            window.location.reload();
        } catch (error) {
            console.error('handleChangeRoom: ', error)    
        }
    }

    const fetchCurrent = async (id) => {
        try {
            const res = await roomProxy.getCurrentRoom(id)
            if (!res?.ok) {
                throw new Error('Failed get current room');
            }
            const cur = await res.json()            
            setRoomTenants(cur?.data[0] || {})
        } catch (error) {
            console.error('fetchCurrent: ', error)
        }
    }

    const handleEdit = async (id) => {
        try {
            fetchCurrent(id)
            const res =await tenantsProxy.getTenant(id)
            if (!res?.ok) {
                throw new Error("Failed to get tenant detail");
            }
            const data = await res.json()
            setItem(data?.data);
            setIsModalEditOpen(true)
        } catch (error) {
            console.error('handleEdit: ', error)
        }
    }

    const handleSubmitUpdateTenent = async () => {
        try {
            const res = await tenantsProxy.updateTenant(item.id, item)
            if (!res?.ok) {
                throw new Error('Failed update tenant')
            }
            fetchTenants()
            handleCloseModal()
        } catch (error) {
            console.error('handleSubmitUpdateTenent: ', error)
        }
    }

    const confirmDeleteModal = (id) => {
        setItem({ ...item, id: id })
        setIsConfirmOpen(true)
    };

    const handleDelete = async (id) => {
        try {
            const res = await tenantsProxy.deleteTenant(id)
            if (!res?.ok) {
                throw new Error("Failed to delete tenant detail");
            }
            fetchTenants()
            handleCloseModal()
        } catch (error) {
            handleCloseModal()
            console.error('handleDelete: ', error)
        }
    }

    const billing = async (row) => {
        try {
            const res = await tenantsProxy.downloadBill(row.id)
            if (!res?.ok) {
                throw new Error("Failed to delete tenant detail");
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error("billing : ", error)
        }
    }


    const handleCloseModal = () => {
        setIsModalCreateOpen(false);
        setIsModalEditOpen(false)
        setIsConfirmOpen(false)
        setItem({})
    }

    useEffect(() => {
        fetchTenants(currentPage);
    }, [fetchTenants, currentPage]);

    useEffect(() => {
        if (isModalEditOpen === true && !fetched.current) {
            fetched.current = true
            fetchVacant()
        }
    }, [roomList, setRoomList, isModalEditOpen])

    return (
        <div className='p-3'>
            <div className="container px-4 mx-auto">
                <div className='flex justify-between'>
                    <div className='text-4xl p-3'>หน้าจัดการผู้เช่า</div>
                    <div className='flex justify-end pb-3 pt-4'>
                        <Button
                            className="ml-3"
                            onClick={() => setIsModalCreateOpen(true)}
                        >
                            เพิ่มผู้เช่า
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container p-4 mx-auto mt-8">
                <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลผู้เช่า</h1>

                {/* ส่ง props ทั้งหมดไปให้ Table */}
                <Table
                    data={tenants}
                    columns={COLUMNS}
                    isLoading={isLoading}
                    onEdit={(row) => handleEdit(row.id)}
                    onDelete={(row) => confirmDeleteModal(row.id)}
                    onActions={[
                        {
                            key: "1",
                            action: billing,
                            icon: <BanknotesIcon className="h-5 w-5 text-blue-600" />
                        }
                    ]}
                />
                <div className="mt-4 flex justify-center">
                    <Pagination
                        count={Math.ceil(totalItems / pageSize)} // จำนวนหน้าทั้งหมด
                        page={currentPage} // หน้า active
                        onChange={(e, page) => setCurrentPage(page)} // update state แล้ว useEffect จะ fetch API
                        size='medium'
                        color="primary"
                        shape="rounded"
                    />
                </div>
            </div>

            {isModalCreateOpen && (
                <Modal className="max-w-4xl">
                    <div className='flex flex-col gap-3'>
                        <div className='text-2xl p-4 text-center'>เพิ่มผู้เช่า</div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ชื่อ-นามสกุล"
                                    onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">email</label>
                                <input
                                    type="text"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="example@example.com"
                                    onChange={(e) => setItem(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="082-xxx-xxxx"
                                    onChange={(e) => setItem(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">บัตรประขาชน</label>
                                <input
                                    type="text"
                                    id="id_card"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="identity card number"
                                    onChange={(e) => setItem(prev => ({ ...prev, id_card: e.target.value }))}
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm/6 font-medium text-gray-900">Upload เอกสารหลักฐาน</label>
                                <UploadFile onChange={(e) => console.log(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">Upload สัญญาเช่า</label>
                                <UploadFile />
                            </div> */}
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">สถานะ</label>
                                <select
                                    id="status"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    onChange={(e) => setItem(prev => ({ ...prev, status: e.target.value }))}
                                    value={item.status || "ACTIVE"}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <Button
                                className={"w-20"}
                                onClick={handleSubmitCreateTenent}
                            >
                                Submit
                            </Button>
                            <Button
                                className={"w-20 bg-rose-600 hover:bg-rose-700"}
                                onClick={handleCloseModal}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {isModalEditOpen && (
                <Modal className="max-w-4xl">
                    <div className='flex flex-col gap-3'>
                        <div className='text-2xl p-4 text-center'>แก้ไขผู้เช่า</div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ชื่อ-นามสกุล"
                                    value={item.name}
                                    onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">email</label>
                                <input
                                    type="text"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="example@example.com"
                                    value={item.email}
                                    onChange={(e) => setItem(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="082-xxx-xxxx"
                                    value={item.phone}
                                    onChange={(e) => setItem(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">บัตรประขาชน</label>
                                <input
                                    type="text"
                                    id="id_card"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="identity card number"
                                    value={item.id_card}
                                    onChange={(e) => setItem(prev => ({ ...prev, id_card: e.target.value }))}
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm/6 font-medium text-gray-900">Upload เอกสารหลักฐาน</label>
                                <UploadFile onChange={(e) => console.log(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">Upload สัญญาเช่า</label>
                                <UploadFile />
                            </div> */}
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">สถานะ</label>
                                <select
                                    id="status"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    onChange={(e) => setItem(prev => ({ ...prev, status: e.target.value }))}
                                    value={item.status || "ACTIVE"}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หมายเลขห้อง</label>
                                <select
                                    id="status"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    onChange={(e) => handleChangeRoom(parseInt(e.target.value))}
                                    value={item.room_id}
                                >
                                    <option >{roomTenants.room_no}</option>
                                    {roomList && roomList.map(room => {
                                        return <option value={room.id}>{room.room_no}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <Button
                                className={"w-20"}
                                onClick={handleSubmitUpdateTenent}
                            >
                                Submit
                            </Button>
                            <Button
                                className={"w-20 bg-rose-600 hover:bg-rose-700"}
                                onClick={handleCloseModal}
                            >
                                Close
                            </Button>
                        </div>
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
                            onClick={async () => await handleDelete(item.id)}
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

export default TenantsManagement