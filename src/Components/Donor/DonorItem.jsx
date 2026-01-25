import React from 'react'
import { User } from "lucide-react";
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { Eye } from 'lucide-react';
const DonorItem = () => {
  return (
    <div className=' bg-white p-2 rounded-lg shadow grid grid-cols-6 items-center gap-4 hover:bg-gray-50 '>
        {/* DONOR */}
        <div className=' flex items-center gap-3'>
            <div className=' rounded-full bg-red-500 w-fit shadow p-3 text-white'>
                <User size={20}/>
            </div>
            <div className=' flex flex-col items-start'>
                <h3 className=' font-semibold leading-[1.2] text-base'>John Smith</h3>
                <p className=' text-sm text-gray-500'>Male</p>
            </div>
        </div>

        {/* BLOOD GROUP */}
        <div className=' text-center bg-blue-100 text-blue-600 w-fit py-2 px-4 rounded-2xl'>
            <h3 className=' font-bold'>O+</h3>
        </div>

        {/* CONTACT */}
        <div className=' text-gray-500'>
            <div className='   flex space-y-1 items-center gap-3 text-base'>
                <Mail size={14}/>
                <p>john.smith@email.com</p>
            </div>
            <div className=' flex items-center gap-2 text-base'>
                <Phone size={14} />
                <p>+1 234 567 8901</p>

            </div>
        </div>

        {/* LOCATION */}
        <div className=' text-gray-500 flex items-center gap-2 text-base'>
            <MapPin size={14} />
            <p>123 Main St, USA</p>
        </div>

        {/* STATUS */}
        <div className=' flex items-center gap-1 bg-gray-200 w-fit py-2 px-4 rounded-lg text-gray-600 text-sm'>
            <CircleCheckBig size={14}/>
            <p>Unavailable</p>
        </div>

        {/* Actions */}
        <div className=' flex items-center gap-7 font-medium text-base'>
            <Eye size={18} />
            <p className=' bg-white rounded-lg cursor-pointer shadow border border-gray-100 py-2 px-4'>Mark Available</p>
        </div>
    </div>
  )
}

export default DonorItem