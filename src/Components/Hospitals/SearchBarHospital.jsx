import React from 'react'
import { Search } from 'lucide-react'

const SearchBarHospital = () => {
  return (
   <div className="flex flex-col lg:flex-row gap-3 bg-white shadow w-full p-4 rounded-lg">
      
      {/* SEARCH INPUT */}
      <div className="border flex-1 border-gray-200 text-gray-500 p-3 rounded-lg flex gap-3 focus-within:ring">
        <Search />
        <input
          className="w-full outline-none"
          placeholder="Search hospitals by name or city..."
        />
      </div>
    </div>
  )
}

export default SearchBarHospital