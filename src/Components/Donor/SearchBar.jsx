import React, { useState } from "react";
import { Search } from "lucide-react";
const SearchBar = () => {
  const [searchVal, setSearchVal] = useState("");
  const bloodGroups = ['A+','A-','AB+','AB-','O+','O-','B+','B-']
  return (
    <div className=" flex gap-3 items-center bg-white shadow w-full p-4 rounded-lg ">
      <div className=" border flex-1 focus-within:ring-1 focus-within:  border-gray-200 text-gray-500 p-3 rounded-lg  flex gap-3">
        <Search />
        <input
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          className=" w-full outline-none bg-white"
          type="text"
          placeholder="Search by name, email, or city.."
        ></input>
      </div>
      <div className=" flex gap-3">
        <div className=" border border-gray-200 text-gray-500 p-3 rounded-lg ">
          <select>
            <option>All Groups</option>
            {bloodGroups.map((elem)=>{
                return <option>{elem}</option>
            })}
          </select>
        </div>
        <div className=" border border-gray-200 text-gray-500 p-3 rounded-lg ">
          <select>
            <option>All Status</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
