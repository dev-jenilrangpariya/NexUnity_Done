import React from 'react'
import { cn } from '../../lib/utils'

const TableCompo = ({ className, data, editButton, deleteButton, handleDelete, handleEdit, ...props }) => {
    if (!data || data.length == 0) {
        return <p>Not Any data Available</p>
    }

    const columns = Object.keys(data[0])
    console.log(data)
    return (
        <table className={cn("table-auto w-full border-separate border-spacing-y-[8px] text-center", className)} {...props}>
            <thead>
                <tr>
                    {
                        columns?.map((column,index) => (
                            <th key={index}>
                                {column}
                            </th>
                        ))

                    }
                    {
                        editButton && <th>Edit</th>
                    }
                    {
                        deleteButton && <th>Delete</th>
                    }
                </tr>

            </thead>
            <tbody>
                {data?.map((row, rowIndex) => (
                    <tr key={rowIndex} className='table-row'>
                        {columns?.map((column, columnIndex) => (
                            <td key={columnIndex} className={cn("dark:bg-dark-800 bg-white dark:text-white align-middle p-3")}>{row[column]}</td>
                        ))}
                        {
                            editButton &&
                            <td className={cn("dark:bg-dark-800 bg-white dark:text-white  align-middle p-3")}>
                                <span className='w-6 h-6  rounded-full text-blue-800 flex items-center justify-center ms-auto cursor-pointer text-center' onClick={() => handleEdit(row[columns[0]])}>
                                    {/* <IcnOpenEye className="w-4 h-4  text-dark-950 dark:text-theme" /> */}
                                    edit
                                </span>
                            </td>
                        }
                        {
                            deleteButton &&
                            <td className={cn("dark:bg-dark-800 bg-white dark:text-white  align-middle p-3")}>
                                <span className='w-6 h-6  rounded-full text-red-800 flex items-center justify-center ms-auto cursor-pointer text-center' onClick={() => handleDelete(row[columns[0]])}>
                                    {/* <IcnOpenEye className=" text-black" /> */}
                                    delete
                                </span>
                            </td>
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableCompo