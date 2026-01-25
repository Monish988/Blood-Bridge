import React, { useEffect, useState ,useMemo } from "react";
import SearchBar from "./SearchBar";
import { CircleCheckBig, Users } from "lucide-react";
import { CircleX } from "lucide-react";
import DonorItem from "./DonorItem";
import donors from "../../donor";


const Donor = (props) => {
  const data = props.props;
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [status, setStatus] = useState("");

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch =
        donor.name.toLowerCase().includes(search.toLowerCase()) ||
        donor.email.toLowerCase().includes(search.toLowerCase()) ||
        donor.location.toLowerCase().includes(search.toLowerCase());

      const matchesGroup =
        group === "" || donor.bloodGroup === group;

      const matchesStatus =
        status === "" || donor.status === status;

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [search, group, status]);
  
  return (
    <div
      className="
      flex-1
      bg-gray-100
      px-4 sm:px-6 lg:px-9
      py-6
      space-y-8
    "
    >
      {/* TOP */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2  className="font-bold text-3xl">Donors</h2>
          <p className="text-base text-gray-400">
            Manage registered blood donors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm bg-green-200 py-1 px-2 rounded-lg text-green-600 flex gap-1 items-center">
            <Users size={16} />
            <p>6 total</p>
          </div>
          <div className="text-sm bg-blue-200 py-1 px-2 rounded-lg text-blue-600">
            <p>4 Available</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <SearchBar search={search} setSearch={setSearch} group={group} setGroup={setGroup} status={status} setStatus={setStatus} />

      {/* TABLE HEADER (desktop only) */}
      <div className="hidden lg:grid grid-cols-6 gap-4 font-semibold text-gray-500 border-b pb-2">
        <p>Donor</p>
        <p>Blood Group</p>
        <p>Contact</p>
        <p>Location</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      {/* LIST */}
      <div className=" space-y-1">
        {filteredDonors.map((data) => {
          return (
            <DonorItem key={data.id} name={data.name} sex={data.gender} BG={data.bloodGroup} mail={data.email} phone={data.phone} status={data.status} location={data.location} icon = {(data.status=='Available')?CircleCheckBig:CircleX}  />
          );
        })}
      </div>
    </div>
  );
};

export default Donor;
