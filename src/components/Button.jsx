import React from 'react'

const Button = ({ className, onClick,children }) => {
    return (
        <>
            <button
                className={className + ' bg-blue-400 p-4 text-white rounded-full'}
                onClick={onClick}
            >
                {children}
            </button>
        </>
    )
}

export default Button