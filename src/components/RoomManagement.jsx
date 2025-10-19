import React, { useState, useEffect, useRef, useCallback } from 'react'
import Button from './Button'
import Modal from './Modal';
import UploadFile from './UploadFile';
import Table from './Table';
import Pagination from '@mui/material/Pagination';
import buildingProxy from '../proxy/building';
import roomsProxy from '../proxy/rooms';
import TransferList from './TransferList';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const COLUMNS = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'building', headerName: 'ชื่ออาคาร', flex: 1 },
    { field: 'floor', headerName: 'หมายเลขชั้น', flex: 1 },
    { field: 'room_no', headerName: 'หมายเลขห้อง', flex: 1 },
    { field: 'status', headerName: 'สถานะ', flex: 1 },
];


const pageSize = 10;
function RoomManagement({ }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [item, setItem] = useState({ status: "OCCUPIED" });
    const [buildingSelected, setBuildingSelected] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddRentalModalOpen, setIsAddRentalModalOpen] = useState(false)

    const fetched = useRef(false);
    const fetchRooms = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await roomsProxy.getRooms(page, pageSize, 'ASC')
            if (!res.ok) {
                throw new Error("Failed to fetch buildings");
            }
            const data = await res.json();
            const roomsData = data?.data.map((room) => ({
                id: room.id,
                building: room.building.name,
                floor: room.floor,
                room_no: room.room_no,
                status: room.status,
            }));

            setRooms(roomsData);
            setTotalItems(data?.total_rows);
        } catch (err) {
            console.error("fetchBuildings: ", err);
            // setError(err.message);
        }
        setIsLoading(false);
    }, [currentPage]);

    const fetchBuildings = useCallback(async () => {
        try {
            const res = await buildingProxy.getBuildingsDropdown()
            if (!res.ok) {
                throw new Error("Failed to fetch buildings");
            }
            const data = await res.json();
            const buildingsData = data.map((building) => ({
                id: building.id,
                name: building.name,
            }));
            setBuildings(buildingsData);
        } catch (err) {
            console.error("fetchBuildings: ", err);
            // setError(err.message);
        }
    }, []);

    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetchBuildings();
        }
    }, [fetchBuildings]);

    useEffect(() => {
        fetchRooms(currentPage);
    }, [fetchRooms, currentPage]);

    const handleOnBuildingChange = (e) => {
        setBuildingSelected({ id: parseInt(e.target.value), name: e.target.text });
        setItem(prev => ({ ...prev, building_id: e.target.value }));
    }

    const handleSubmitEditRooms = async () => {
        try {
            const payload = {
                floor: item.floor,
                room_no: item.room_no,
                status: item.status,
            };
            const res = await roomsProxy.updateRooms(item.id, payload);
            if (!res.ok) {
                throw new Error("Failed to edit room");
            }
            // Refresh the rooms list after successful edit
            fetchRooms();
            handleCloseModal();
        } catch (err) {
            console.error("handleSubmitEditRooms: ", err);
            // Handle error (e.g., show error message to user)
        }
    }

    const confirmDeleteModal = (id) => {
        setItem({ id });
        setIsConfirmOpen(true)
    };
    
    const addRentalModal = (id) => {
         setItem({ id });
         setIsAddRentalModalOpen(true)
    }

    const handleSubmitCreateRooms = async () => {
        try {
            const payload = {
                building_id: parseInt(item.building_id),
                floor: item.floor,
                room_no: item.room_no,
                status: item.status,
            };

            const res = await roomsProxy.createRooms([payload]);
            if (!res.ok) {
                throw new Error("Failed to create room");
            }
            // Refresh the rooms list after successful creation
            fetchRooms();
            handleCloseModal();
        } catch (err) {
            console.error("handleSubmitCreateRooms: ", err);
            // Handle error (e.g., show error message to user)
        }
    }

    const handleDelete = async () => {
        try {
            const res = await roomsProxy.deleteRooms(item.id);
            if (!res.ok) {
                throw new Error("Failed to delete room");
            }
            // Refresh the rooms list after successful deletion
            fetchRooms();
            setIsConfirmOpen(false);
        } catch (err) {
            console.error("handleDelete: ", err);
            // Handle error (e.g., show error message to user)
        }
    }

    const editModal = (item) => {
        setItem(item);
        setIsEditModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setItem({ status: "OCCUPIED" });
        setBuildingSelected({});
        setCurrentPage(1);
    }
    return (
        <div><div className="container px-4 mx-auto">
            <div className='flex justify-between'>
                <div className='text-4xl p-3'>หน้าจัดการห้องเช่า</div>
                <div className='flex justify-end pb-3 pt-4'>
                    <Button
                        className="ml-3"
                        onClick={() => setIsModalOpen(true)}
                    >
                        เพิ่มห้องเช่า
                    </Button>
                </div>
            </div>
        </div>
            <div className="container p-4 mx-auto mt-8">
                <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลห้องเช่า</h1>
                <Table
                    data={rooms}
                    columns={COLUMNS}
                    onEdit={(row) => editModal(row)}
                    onDelete={(row) => confirmDeleteModal(row.id)}
                    onActions={[{
                        key: "1",
                        action: addRentalModal,
                        icon: <PlusCircleIcon className="h-5 w-5 text-blue-600" />
                    }]}
                    loading={isLoading}
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

            {isModalOpen && (
                <Modal className="max-w-4xl">
                    <div className='flex flex-col gap-3'>
                        <div className='text-2xl p-4 text-center'>เพิ่มห้องเช่า</div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">เลือกอาคาร</label>
                            <select
                                id="type"
                                value={buildingSelected.id || ""}
                                onChange={handleOnBuildingChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                            >
                                <option value="" disabled hidden>เลือกอาคาร</option>
                                {buildings.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หมายเลขชั้น</label>
                                <input
                                    type="number"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="หมายเลขชั้น"
                                    value={item.floor || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หมายเลขห้อง</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="หมายเลขห้อง"
                                    value={item.room_no || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, room_no: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">status</label>
                                <select
                                    id="status"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    onChange={(e) => {
                                        setItem(prev => ({ ...(prev ?? {}), status: e.target.value }));
                                    }}
                                    value={item?.status ?? "OCCUPIED"}
                                >
                                    <option value="OCCUPIED">OCCUPIED</option>
                                    <option value="VACANT">VACANT</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <Button
                                className="w-40"
                                onClick={handleSubmitCreateRooms}
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
                        <div className='text-2xl p-4 text-center'>แก้ห้องเช่า</div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">เลือกอาคาร</label>
                            <input
                                type='text'
                                id="type"
                                value={item.building || ""}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                disabled
                            >
                            </input>
                        </div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หมายเลขชั้น</label>
                                <input
                                    type="number"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="หมายเลขชั้น"
                                    value={item.floor || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">หมายเลขห้อง</label>
                                <input
                                    type="text"
                                    id="type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    placeholder="หมายเลขห้อง"
                                    value={item.room_no || ""}
                                    onChange={(e) => setItem(prev => ({ ...prev, room_no: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm/6 font-medium text-gray-900">status</label>
                                <select
                                    id="status"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                    onChange={(e) => {
                                        setItem(prev => ({ ...(prev ?? {}), status: e.target.value }));
                                    }}
                                    value={item?.status ?? "OCCUPIED"}
                                >
                                    <option value="OCCUPIED">OCCUPIED</option>
                                    <option value="VACANT">VACANT</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <Button
                                className="w-40"
                                onClick={handleSubmitEditRooms}
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

            {isAddRentalModalOpen && (
                <Modal className="max-w-xl">
                    <div>
                        <div className='text-xl p-4 text-center'>เพิ่มรายการให้เช่า</div>
                    </div>
                    <div className='p-4'>
                        <TransferList />
                    </div>
                    <div className='flex justify-center gap-3'>
                        <Button
                            className={"w-25"}
                            onClick={() => setIsAddRentalModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default React.memo(RoomManagement)