import React from 'react'
const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/80">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
        {children}
      </div>
    </div>
  );
};


export default Modal