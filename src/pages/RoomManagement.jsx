import React, { useState } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

const COLUMNS = [
    { header: 'ID', accessor: 'id' },
    { header: 'หมายเลขตึก', accessor: 'building' },
    { header: 'หมายเลขชั้น', accessor: 'floor' },
    { header: 'หมายเลขห้อง', accessor: 'room' },
    { header: 'ราคา (บาท)', accessor: 'price' },
    { header: 'หน่วย', accessor: 'unit' },
    { header: 'สถานะ', accessor: 'status' },
];

const DATA = [
    {
        id: 1,
        building: "A",
        floor: "2",
        room: "201",
        price: "5,000",
        unit: "เดือน",
        status: "มีผู้เช่า"
    }
]

const pageSize = 10;

function RoomManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className='p-3'>
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
            <div>
                <Table
                    data={DATA}
                    columns={COLUMNS}
                    pageSize={pageSize}
                    currentPage={currentPage}
                />

                <Pagination
                    totalItems={DATA.length}
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
    )
}

export default RoomManagement