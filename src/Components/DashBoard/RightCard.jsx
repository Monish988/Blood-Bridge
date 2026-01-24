import React from 'react'
import { Users } from 'lucide-react'
import { Activity } from 'lucide-react'
import { Droplet } from 'lucide-react'
import { CircleAlert } from 'lucide-react'

const RightCard = (props) => {
    const LucideIcon = props.icon
  return (
    <div className=' bg-white w-70 rounded-lg p-7 shadow-lg'>
        <div className=' flex items-center justify-between'>
            <div className=' space-y-2'>
                <p className=' text-sm text-gray-500'>{props.title}</p>
                <h2 className=' font-bold text-3xl'>{props.count}</h2>
            </div>
            <div className={ `shadow-xl w-fit p-4 rounded-2xl text-white ${props.color}`}>
                <LucideIcon size={20} />
            </div>
        </div>
        <div>

        </div>
    </div>
  )
}

export default RightCard