import React, { useState } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal';

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
                <Modal>
                    <div className='text-2xl p-4'>เพิ่มห้องเช่า</div>
                    <div className='flex justify-end gap-3'>
                        <Button
                            className={"w-20"}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Submit
                        </Button>
                        <Button
                            className={"w-20 bg-rose-600"}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Rental