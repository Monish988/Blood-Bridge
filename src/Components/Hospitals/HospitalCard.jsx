import React from 'react'
import { Building2 } from 'lucide-react'
import { CircleCheckBig,Mail,Phone,MapPin,SquarePen,Trash2 } from 'lucide-react'
const HospitalCard = (props) => {
    console.log(props)
  return (
    <div className=' bg-white w-lg rounded-lg py-4 px-6 shadow-md'>
        {/* SECTION 1 */}
        <div className=' py-4  flex gap-3'>
            <div className=' flex items-center text-white bg-blue-500 w-fit px-4 py-1  rounded-xl'>
                <Building2 size={32} />
            </div>
            <div className=' flex flex-col gap-1'>
                <h2 className=' font-bold text-xl'>{props.name}</h2>
                <div className=' bg-green-200 w-fit text-green-700 py-1 px-2 rounded-lg h-fit flex  items-center gap-1'>
                    <CircleCheckBig size={16}/>
                    <p className=' font-base text-sm'>Verified</p>
                </div>
                
            </div>
    
        </div>

        {/* SECTION 2 */}
        <div className=' py-2  '>
            <div className=' space-y-2'>
                <div className=' flex items-center gap-2 text-gray-500  text-base'>
                    <Mail size={19}/>
                    <p>{props.email}</p>
                </div>
                <div className=' flex items-center gap-2 text-gray-500  text-base'>
                    <Phone size={19}/>
                    <p>{props.phone}</p>
                </div>
                <div className=' flex items-center gap-2 text-gray-500  text-base'>
                    <MapPin size={19}/>
                    <p>{props.city}</p>
                </div>
                <div className=' flex items-center gap-2 text-gray-500  text-sm'>
                    <p>{props.license}</p>
                </div>
            </div>
        </div>

        {/* SECTION 3 */}
        <div className=' flex gap-4 items-center mt-5'>
            <button className=' cursor-pointer text-base text-gray-600 rounded-lg border border-gray-200 shadow px-8 py-1 w-full'>Unverify</button>
            <div className=' flex gap-5  items-center'>
                <SquarePen size={19} className=' cursor-pointer'/>
                <Trash2 size={19} className='text-red-500 cursor-pointer'/>
            </div>
        </div>
    </div>
  )
}

export default HospitalCard