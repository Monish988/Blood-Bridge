import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = (props) => {
  const [searchVal, setSearchVal] = useState("");
  const bloodGroups = ["A+", "A-", "AB+", "AB-", "O+", "O-", "B+", "B-"];

  return (
    <div className="flex flex-col lg:flex-row gap-3 bg-white shadow w-full p-4 rounded-lg">
      
      {/* SEARCH INPUT */}
      <div className="border flex-1 border-gray-200 text-gray-500 p-3 rounded-lg flex gap-3">
        <Search />
        <input
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          className="w-full outline-none"
          placeholder="Search by name, email, or city..."
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="border border-gray-200 p-3 rounded-lg">
          <select value={props.group} onChange={(e)=>{
            props.setGroup(e.target.value);
          }
          } className="w-full">
            <option value="">All Groups</option>
            {bloodGroups.map(bg => (
              <option value={bg} key={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="border border-gray-200 p-3 rounded-lg">
          <select value={props.status} onChange={(e)=>{
            props.setStatus(e.target.value);
          }} className="w-full">
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
