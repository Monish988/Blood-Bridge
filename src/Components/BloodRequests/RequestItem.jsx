import React from 'react'
import { Plus, CircleCheckBig, Building2, Phone,Clock,Bell,CircleX } from "lucide-react";

export const RequestItem = () => {
  return (
       <div className=" bg-white py-5 shadow px-4  rounded-lg flex justify-between items-center">
        <div className=" flex gap-3 items-center">
          <div className=" flex flex-col items-center w-fit gap-2">
            <h2 className=" bg-red-300 w-fit py-2 px-5 text-red-700 font-bold text;lg rounded-full">
              A-
            </h2>
            <p className=" text-gray-500 text-sm">1 Units</p>
          </div>
          <div className=" space-y-2">
            <div className=" flex gap-3">
              <div className=" bg-green-200 w-fit text-green-700 py-1 px-2 rounded-lg h-fit flex  items-center gap-1">
                <p className=" font-base text-sm">Low</p>
              </div>
              <div className=" bg-blue-200 w-fit text-blue-700 py-1 px-2 rounded-lg h-fit flex  items-center gap-1">
                <p className=" font-base text-sm">Pending</p>
              </div>
            </div>
            <div className=" flex items-center gap-2 text-gray-600">
              <Building2 size={16} />
              <h3 className=" font-semibold">
                Metro Blood Bank
                <span className=" text-gray-400"> • Los Angeles</span>
              </h3>
            </div>
            <div className="flex text-gray-600 items-center gap-2">
              <Phone size={16} />
              <p>+1 555 200 3000</p>
            </div>
            <div className="flex gap-2 text-gray-600 items-center">
              <Clock size={16} />
              <p>Jan 24, 12:33 PM</p>
            </div>
          </div>
        </div>
        <div className=" flex gap-3">
          <button className=" hover:text-black hover:bg-blue-200/20 flex items-center gap-3 text-blue-600 border font-semibold text-sm border-blue-500 rounded-md px-4 py-2"><span><Bell size={17}/></span>Notify Donors</button>
          <button className=" hover:text-black hover:bg-green-200/20 flex items-center gap-3 text-green-600 border font-semibold text-sm border-green-500 rounded-md px-4 py-2"><span><CircleCheckBig size={17}/></span>Mark Fulfilled</button>
          <button className=" hover:text-black hover:bg-gray-200/20 flex items-center gap-3 text-black-600 border font-semibold text-sm border-gray-500 rounded-md px-4 py-2"><span><CircleX size={17}/></span>Cancel</button>
        </div>
      </div>
  )
}
