import React from 'react'

const BackDrop = ({showModal,setShowModal}) => {
  return (
    <div className='h-screen w-full top-0 start-0 fixed bg-[#000]/50 z-30'
    onClick={()=>setShowModal(false)}>
    </div>
  )
}

export default BackDrop