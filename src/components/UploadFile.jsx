import React from 'react'

function UploadFile({onChange}) {
    return (
        <>
            <div className='flex '>
                <label className='bg-blue-400 text-white rounded-l-lg p-1 px-2 text-nowrap'>Upload File</label>
                <input
                    className='bg-neutral-100 w-full hover:bg-neutral-300 text-black rounded-r-lg p-1'  
                    type='file'
                    onChange={onChange} 
                />
            </div>
        </>
    )
}

export default UploadFile