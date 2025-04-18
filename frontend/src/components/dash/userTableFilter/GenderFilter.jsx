import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select'



const genderList = ["All", "Male", "Female"]

const GenderFilter = ({ selectedgender, setselectedgender }) => {
    return (
        <Select onValueChange={(e) => setselectedgender(e)} value={selectedgender}>
            <SelectTrigger className="h-12 w-full !border border-backgroundv3 focus:border focus:border-backgroundv3   text-textPrimary font-popins text-14 lg:text-14 bg-backgroundv2 rounded-lg py-3 px-3 ">
                <div className='flex gap-2 items-center text-textPrimary'>
                    <h2>Gender : </h2>
                    <SelectValue className='capitalize text-textPrimary ' />
                </div>
            </SelectTrigger>
            <SelectContent className='text-14 !bg-backgroundv2'>
                {
                    genderList?.map((item,index) => (
                        <SelectItem value={item} key={index} className='capitalize text-textPrimary hover:border-0 hover:outline-none focus:outline-none focus:border-none hover:bg-lightGray'>{item}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>

    )
}

export default GenderFilter