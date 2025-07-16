import React, { useState } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal';
import UploadFile from '../components/UploadFile';

function Rental() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className='text-2xl p-4'>จัดการค่าเช่า</div>
            <div className='flex justify-end'>
                <Button
                    className="ml-3"
                    onClick={() => setIsModalOpen(true)}
                >
                    เพิ่มห้องเช่า
                </Button>
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
        </>
    )
}

export default Rental