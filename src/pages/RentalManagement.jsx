import React, { useState } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

const COLUMNS = [
    { header: 'ID', accessor: 'id' },
    { header: 'ประเภท', accessor: 'type' },
    { header: 'หมวดหมู่', accessor: 'category' },
    { header: 'กลุ่ม', accessor: 'group' },
    { header: 'รายการ', accessor: 'item' },
    { header: 'ราคา (บาท)', accessor: 'price' },
    { header: 'หน่วย', accessor: 'unit' },
    { header: 'สถานะ', accessor: 'status' },
];

const DATA = [
    {
        id: 1,
        type: "งานบริการ",
        category: "ทำความสะอาด",
        group: "เครื่องใช้ไฟฟ้า",
        item: "ล้างแอร์",
        unit: "เครื่อง",
        price: "500",
        status: "ACTIVE"
    },
    {
        id: 2,
        type: "งานบริการ",
        category: "ทำความสะอาด",
        group: "ภายในห้อง",
        item: "ล้างห้องน้ำ",
        unit: "ครั้ง",
        price: "500",
        status: "ACTIVE"
    },
    {
        id: 3,
        type: "เฟอร์นิเจอร์",
        category: "เครื่องใช้ไฟฟ้า",
        group: "เครื่องใช้ไฟฟ้า",
        item: "แอร์",
        unit: "เครื่อง",
        price: "500",
        status: "ACTIVE"
    },
    {
        id: 4,
        type: "เฟอร์นิเจอร์",
        category: "เครื่องใช้ไฟฟ้า",
        group: "เครื่องครัว",
        item: "ไมโครเวฟ",
        unit: "เครื่อง",
        price: "200",
        status: "ACTIVE"
    },
    {
        id: 5,
        type: "ลานจอดรถ",
        category: "ลานจอดรถ",
        group: "ลานจอดรถ",
        item: "ลานจอดรถ",
        unit: "ที่",
        price: "500",
        status: "ACTIVE"
    },
    {
        id: 6,
        type: "น้ำประปา",
        category: "น้ำประปา",
        group: "น้ำประปา",
        item: "น้ำประปา",
        unit: "หน่วย",
        price: "20",
        status: "ACTIVE"
    },
    {
        id: 7,
        type: "ไฟฟ้า",
        category: "ไฟฟ้า",
        group: "ไฟฟ้า",
        item: "ไฟฟ้า",
        unit: "หน่วย",
        price: "8",
        status: "ACTIVE"
    },
    {
        id: 8,
        type: "ห้องเช่า",
        category: "ห้องเช่า",
        group: "ห้องเช่า",
        item: "ห้องเช่า Std.",
        unit: "เดือน",
        price: "3,000",
        status: "ACTIVE"
    },
    {
        id: 9,
        type: "ห้องเช่า",
        category: "ห้องเช่า",
        group: "ห้องเช่า",
        item: "ห้องเช่า D-Lux",
        unit: "เดือน",
        price: "5,000",
        status: "ACTIVE"
    },
    {
        id: 10,
        type: "ห้องเช่า",
        category: "ห้องเช่า",
        group: "ห้องเช่า",
        item: "ห้องเช่ารายวัน",
        unit: "วัน",
        price: "500",
        status: "ACTIVE"
    },
    {
        id: 11,
        type: "ห้องเช่า",
        category: "ห้องเช่า",
        group: "ห้องเช่า",
        item: "ห้องเช่าชั่วคราว",
        unit: "ชั่วคราว",
        price: "300",
        status: "ACTIVE"
    },
]

const pageSize = 10;

function RentalManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className='p-3'>
            <div className="container px-4 mx-auto">
                <div className='flex justify-between'>
                <div className='text-4xl p-3'>หน้าจัดการรายการใช้เช่า</div>
                <div className='flex justify-end pb-3 pt-4'>
                    <Button
                        className="ml-3"
                        onClick={() => setIsModalOpen(true)}
                    >
                        เพิ่มรายการ
                    </Button>
                </div>
            </div>
            </div>
            <div className="container p-4 mx-auto mt-8">
                <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลผู้ใช้งาน</h1>

                <Table
                    data={DATA}
                    columns={COLUMNS}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onView={(row) => console.log(row.id)}
                    onEdit={(row) => console.log(row.id)}
                    onDelete={(row) => console.log(row.id)}
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
                        <div className='text-2xl p-4 text-center'>เพิ่มรายการ</div>
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

export default RentalManagement