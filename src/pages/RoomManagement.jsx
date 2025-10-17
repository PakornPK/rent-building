import React, { useState, Suspense, lazy } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';
import Table from '../components/Table';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CustomTabPanel from '../components/CustomTabPanel';
import { BuildingOffice2Icon, KeyIcon } from '@heroicons/react/24/outline';
import CircularLazy from '../components/CircularLazy';


const BuildingManagement = lazy(() => import('../components/BuildingManagement'));
const RoomManagement = lazy(() => import('../components/RoomManagement'));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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


function RoomManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [value, setValue] = useState(0);
    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    // };

    const handleTabChange = (_event, newValue) => setValue(newValue);
    return (
        <div className='p-3'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabChange} contextMenu='pointer'>
                    <Tab icon={<BuildingOffice2Icon />} iconPosition="start" label="จัดการอาคาร" {...a11yProps(0)} />
                    <Tab icon={<KeyIcon />} iconPosition="start" label="จัดการห้อง" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <Suspense fallback={<CircularLazy />}
            >
                {/* Tab Panel จัดการอาคาร */}
                <CustomTabPanel value={value} index={0}>
                    <BuildingManagement />
                </CustomTabPanel>
                {/* Tab Panel for "จัดการห้อง" */}
                <CustomTabPanel value={value} index={1}>
                    <RoomManagement />
                </CustomTabPanel>
            </Suspense>
        </div>
    )
}

export default RoomManagementPage