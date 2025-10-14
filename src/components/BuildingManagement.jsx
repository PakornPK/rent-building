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
                    onEdit={(row) => console.log("Edit", row)}
                    onDelete={(row) => console.log("Edit", row)}
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
    )
}

export default React.memo(BuildingManagement)