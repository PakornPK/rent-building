import React, { useState, useEffect, useRef } from 'react'
import Button from './Button'
import Modal from './Modal';
import UploadFile from './UploadFile';
import Table from './Table';
import Pagination from '@mui/material/Pagination';
import buildingProxy from '../proxy/building'

const COLUMNS = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'ชื่อ', flex: 1 },
    { field: 'address', headerName: 'ที่อยู่', flex: 1 },
    { field: 'status', headerName: 'สถานะ', flex: 1 }
];


const pageSize = 10;
function BuildingManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [item, setItem] = useState({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const fetched = useRef(false);

    const fetchBuildings = async () => {
        try {
            const res = await buildingProxy.getBuildings(currentPage, pageSize, 'ASC')
            if (!res.ok) {
                throw new Error("Failed to fetch buildings");
            }
            const data = await res.json();
            setBuildings(data?.data);
            setTotalItems(data?.total_rows);
        } catch (err) {
            console.error("fetchBuildings: ", err);
            // setError(err.message);
        }
    }

    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetchBuildings();
        }
    }, []);

    const handleSubmitCreateBuilding = async () => {
        try {
            const res = await buildingProxy.createBuildings([item]);
            if (!res.ok) {
                throw new Error("Failed to create building");
            }
            // Refresh building list
            fetchBuildings();
            handleCloseModal();
        } catch (err) {
            console.error("handleSubmitCreateBuilding: ", err);
        }
    }
    const confirmDeleteModal = (id) => {
        setItem({ id });
        setIsConfirmOpen(true)
    };

    // TODO: enhance delete building
    const handleDelete = async () => {
        try {
            const res = await buildingProxy.updateBuildings(item.id, { status: "INACTIVE" });
            if (!res.ok) {
                throw new Error("Failed to delete building");
            }
            // Refresh building list
            fetchBuildings();
            setIsConfirmOpen(false);
            setItem({});
        } catch (err) {
            console.error("handleDelete: ", err);
        }
    }

    const editModal = (item) => {
        setItem(item);
        setIsEditModalOpen(true);
    }

    const handleEdit = async () => {
        try {
            const res = await buildingProxy.updateBuildings(item.id, item);
            if (!res.ok) {
                throw new Error("Failed to edit building");
            }
            // Refresh building list
            fetchBuildings();
            handleCloseModal();
        } catch (err) {
            console.error("handleEdit: ", err);
        }
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setItem({});
    }
    return (
        <div>
            <div className="container px-4 mx-auto">
                <div className='flex justify-between'>
                    <div className='text-4xl p-3'>หน้าจัดการอาคาร</div>
                    <div className='flex justify-end pb-3 pt-4'>
                        <Button
                            className="ml-3"
                            onClick={() => setIsModalOpen(true)}
                        >
                            เพิ่มอาคาร
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container p-4 mx-auto mt-8">
                <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลห้องเช่า</h1>
                <Table
                    data={buildings}
                    columns={COLUMNS}
                    onEdit={(row) => editModal(row)}
                    onDelete={(row) => confirmDeleteModal(row.id)}
                />
                <div className="mt-4 flex justify-center">
                    <Pagination
                        count={Math.ceil(totalItems / pageSize)} // จำนวนหน้าทั้งหมด
                        page={currentPage}  // หน้า active
                        onChange={(e, page) => setCurrentPage(page)} //  update state แล้ว useEffect จะ fetch API
                        size='medium'
                        color="primary"
                        shape="rounded"
                    />
                </div>
            </div>
            {/* TODO: Create Modal for building */}
            {isModalOpen && (
                <Modal className="max-w-4xl">
                    <div className='flex flex-col gap-3'>
                        <div className='text-2xl p-4 text-center'>เพิ่มอาคาร</div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ชื่ออาคาร</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ชื่ออาคาร"
                                    value={item.name || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ที่อยู่</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ที่อยู่"
                                    value={item.address || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หน่วย</label>
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
                                className="w-40"
                                onClick={handleSubmitCreateBuilding}
                            >
                                Submit
                            </Button>
                            <Button
                                className="w-40 bg-rose-600 hover:bg-rose-700"
                                onClick={handleCloseModal}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {isEditModalOpen && (
                <Modal className="max-w-4xl">
                    <div className='flex flex-col gap-3'>
                        <div className='text-2xl p-4 text-center'>เพิ่มอาคาร</div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ชื่ออาคาร</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ชื่ออาคาร"
                                    value={item.name || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">ที่อยู่</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="ที่อยู่"
                                    value={item.address || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หน่วย</label>
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
                                className="w-40"
                                onClick={handleEdit}
                            >
                                Submit
                            </Button>
                            <Button
                                className="w-40 bg-rose-600 hover:bg-rose-700"
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
                            onClick={async () => await handleDelete()}
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
    )
}

export default React.memo(BuildingManagement)