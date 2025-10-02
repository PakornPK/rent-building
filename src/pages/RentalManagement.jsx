import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from "react-router-dom";
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import masterDataProxy from '../proxy/masterDataProxy';
import rentalsProxy from '../proxy/rentalsProxy';

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

const pageSize = 10;

function RentalManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isModalFileUploadOpen, setIsModalFileUploadOpen] = useState(false);
    const [isCategoryEnabled, setIsCategoryEnabled] = useState(false);
    const [isGroupEnabled, setIsGroupEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [types, setTypes] = useState([]);
    const [typeSelected, setTypeSelected] = useState({id:0, name:"เลือกประเภท"});
    const [categorySelected, setCategorySelected] = useState({id:0, name:"เลือกหมวดหมู่"});
    const [groupSelected, setGroupSelected] = useState({id:0, name:"เลือกกลุ่ม"});
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [rental, setRental] = useState({ status: "ACTIVE", description: ""})
    const [rentalsList, setRentalsList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [item, setItem] = useState(0);
    const navigate = useNavigate();
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchTypes = useCallback(async () => {
        const res = await masterDataProxy.getMasterData('type');
        if (res?.ok) {
            const data = await res.json();
            setTypes(data);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        const res = await masterDataProxy.getMasterData('category', typeSelected.id);
        if (res?.ok) {
            const data = await res.json();
            setCategories(data);
        }
    }, [typeSelected]);

    const fetchGroups = useCallback(async () => {
        const res = await masterDataProxy.getMasterData('group', categorySelected.id);
        if (res?.ok) {
            const data = await res.json();
            setGroups(data);
        }
    }, [categorySelected]);

    const fetchRentals = useCallback(async () => {
        const res = await rentalsProxy.getRentals(currentPage, pageSize, "ASC");
        if (res?.ok) {
            const { data, total_rows } = await res.json();
            const list = data.map((item) => {
                return {
                    id: item.id,
                    type: item.group.category.type.name,
                    category: item.group.category.name,
                    group: item.group.name,
                    item: item.name,
                    price: item.price.toFixed(2),
                    unit: item.unit,
                    status: item.status,
                };
            });
            setTotalItems(total_rows);
            setRentalsList(list);
        }
    }, [currentPage]);
    
    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    useEffect(() => {
        if (isCategoryEnabled) {
            fetchCategories();
        }
    }, [isCategoryEnabled, fetchCategories]);

    useEffect(() => {
        if (isGroupEnabled) {
            fetchGroups();
        }
    }, [isGroupEnabled, fetchGroups]);

    useEffect(() => {
        if (categories.length === 1) {
            setCategorySelected({ id: categories[0].id, name: categories[0].name });
            setIsGroupEnabled(true);
        }
    }, [categories]);
    
    useEffect(() => {
        if (groups.length === 1) {
            setGroupSelected({ id: groups[0].id, name: groups[0].name });
            setRental({...rental, group_id: groups[0].id});
        }
    }, [groups]);

    const reset = (e) => {
        setIsGroupEnabled(false);
        setIsCategoryEnabled(false);
        setIsCreateModalOpen(false);
        setTypeSelected({id:0, name:"เลือกประเภท"});
        setCategorySelected({id:0, name:"เลือกหมวดหมู่"});
        setGroupSelected({id:0, name:"เลือกกลุ่ม"});
        setRental({ status: "ACTIVE", description: "" });
    };
    const handleTypeChange = (e) => {
        const { value, options, selectedIndex } = e.target;
        setTypeSelected({ id: parseInt(value), name: options[selectedIndex].text });
        setIsCategoryEnabled(true);
        setIsGroupEnabled(false);
      };
    const handleCategoryChange = (e) => {
        setCategorySelected({id:e.target.value, name:e.target.text});
        setIsGroupEnabled(true);

    };

    const handleGroupChange = (e) => {
        setGroupSelected({id:e.target.value, name:e.target.text});
        setRental({...rental, group_id: e.target.value});
    };

    const handleSubmitCreate = async (e) => {
        const res = await rentalsProxy.createRental([rental]);
        if (!res?.ok) {
            throw new Error("Failed to create rental");
        }
        reset();
        window.location.reload();
    };
    const handleDelete = async (id) => {
        const res = await rentalsProxy.deleteRental(id);
        if (!res?.ok) {
            throw new Error("Failed to delete rental");
        }
        reset();
        setIsConfirmOpen(false);
        window.location.reload();
    };
    const confirmDeleteModal = (id) => {
        console.log(id);
        
        setItem(id)
        setIsConfirmOpen(true)
    };
    return (
        <div className='p-3'>
            <div className="container px-4 mx-auto">
                <div className='flex justify-between'>
                    <div className='text-4xl p-3'>หน้าจัดการรายการใช้เช่า</div>
                    <div className='flex justify-end pb-3 pt-4'>
                        <Button
                            className="ml-3"
                            onClick={() => setIsModalFileUploadOpen(true)}
                        >
                            <div className="flex items-center">
                                <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                                เพิ่มรายการด้วยไฟล์
                            </div>
                        </Button>
                        <Button
                            className="ml-3"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <div className="flex items-center">
                                <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                                เพิ่มรายการ
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container p-4 mx-auto mt-8">
                <h1 className="mb-4 text-2xl font-bold">ตารางข้อมูลผู้ใช้งาน</h1>

                <Table
                    data={rentalsList}
                    columns={COLUMNS}
                    onView={(row) => console.log(row.id)}
                    onEdit={(row) => navigate("/rental-management/"+ row.id)}
                    onDelete={(row) => confirmDeleteModal(row.id)}
                />

                <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

            {isCreateModalOpen && (
                <Modal className="max-w-4xl">
                <div className='flex flex-col gap-3'>
                    <div className='text-2xl p-4 text-center'>เพิ่มรายการ</div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">เลือกประเภท</label>
                            <select
                                id="type"
                                value={typeSelected.id || ""}
                                onChange={handleTypeChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                            >
                                <option value="" disabled hidden>เลือกประเภท</option>
                                {types.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">เลือกหมวดหมู่</label>
                            <select
                                id="category"
                                value={categorySelected.id || ""}
                                disabled={!isCategoryEnabled}
                                onChange={handleCategoryChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 disabled:opacity-50"
                            >
                                <option value="" disabled hidden>เลือกหมวดหมู่</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">เลือกกลุ่ม</label>
                            <select
                                id="group"
                                value={groupSelected.id || ""}
                                disabled={!isGroupEnabled}
                                onChange={handleGroupChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 disabled:opacity-50"
                            >
                                <option value="" disabled hidden>เลือกกลุ่ม</option>
                                {groups.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div> 
                            <label className="block text-sm/6 font-medium text-gray-900">ชื่อรายการ</label>    
                            <input 
                                type="text" 
                                id="name" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2" 
                                placeholder="ชื่อรายการ"
                                onChange={(e) => setRental(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div> 
                            <label className="block text-sm/6 font-medium text-gray-900">ราคา</label>    
                            <input 
                                type="number" 
                                step="0.01" 
                                id="price" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2" 
                                placeholder="ราคา"
                                onChange={(e) => setRental(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                            />
                        </div>
                        <div> 
                            <label className="block text-sm/6 font-medium text-gray-900">หน่วย</label>    
                            <input 
                                type="text" 
                                id="unit" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2" 
                                placeholder="ต่อเดือน, ต่อปี"
                                onChange={(e) => setRental(prev => ({ ...prev, unit: e.target.value }))}
                            />
                        </div>
                        <div> 
                            <label className="block text-sm/6 font-medium text-gray-900">หน่วย</label>    
                            <select 
                                id="status" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                onChange={(e) => setRental(prev => ({ ...prev, status: e.target.value }))}
                                value={rental.status || "ACTIVE"}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                        <div> 
                            <label className="block text-sm/6 font-medium text-gray-900">รายละเอียด</label>    
                            <input 
                                type="text" 
                                id="description" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2" 
                                placeholder="รายละเอียด"
                                onChange={(e) => setRental(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end gap-3'> 
                        <Button
                            className="w-40"
                            onClick={() => handleSubmitCreate()}
                        >
                            Submit
                        </Button>
                        <Button
                            className="w-40 bg-rose-600 hover:bg-rose-700"
                            onClick={reset}
                        >
                            Close
                        </Button>
                    </div>
                </div>
                </Modal>
            )}

            {isModalFileUploadOpen && (
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
                                onClick={() => setIsModalFileUploadOpen(false)}
                            >
                                Submit
                            </Button>
                            <Button
                                className={"w-20 bg-rose-600 hover:bg-rose-700"}
                                onClick={() => setIsModalFileUploadOpen(false)}
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
                onClick={async () => await handleDelete(item)}
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

export default RentalManagement