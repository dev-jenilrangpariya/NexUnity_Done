import React from 'react'

const TopBestSectionCompo = () => {
    return (
        <div className='TopBestSection_wrapper w-full justify-between items-center mx-auto px-0 container'>
            <div className='w-full flex justify-between items-center gap-2 sm:gap-10 lg:gap-5   py-[50px] md:py-[200px]'>
                <div className='flex flex-col w-full'>
                    <span className='text-base md:text-lg lg:text-2xl text-start'>we connect top </span>
                    <h3 className='text-lg sm:text-3xl md:text-4xl lg:text-5xl text-end md:text-center'>Polish <span className="text-orange-400">People</span> </h3>
                    <div className='flex justify-end mt-3'>
                        <div className='bg-orange-400 arrow w-[100px] md:w-[200px] lg:w-[300px] h-[2px] '></div>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <span className='text-base md:text-lg lg:text-2xl text-end'>with your</span>
                    <h3 className='text-lg sm:text-3xl md:text-4xl lg:text-5xl text-start md:text-center'><span className="text-blue-500">Community </span>globally</h3>
                    <div className='arrow w-[100px] md:w-[200px] lg:w-[300px] h-[2px] bg-blue-500 mt-3' /></div>
            </div>
        </div>
    )
}

export default TopBestSectionCompo