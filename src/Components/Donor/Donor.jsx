import React, { useEffect, useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { CircleCheckBig, CircleX, Users } from "lucide-react";
import DonorItem from "./DonorItem";
import DonorDetailModal from "./DonorDetailModal";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Donor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔒 Role-based access control - only hospitals can view donors
  useEffect(() => {
    if (user && user.role !== "hospital") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [status, setStatus] = useState("");

  console.log(donors);
  // 🔌 FETCH DONORS
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await api.get("/donors");
        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch donors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // 🔍 FILTER
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch =
        donor.name?.toLowerCase().includes(search.toLowerCase()) ||
        donor.email?.toLowerCase().includes(search.toLowerCase()) ||
        donor.city?.toLowerCase().includes(search.toLowerCase());

      const matchesGroup = group === "" || donor.bloodGroup === group;

      const matchesStatus =
        status === "" ||
        (status === "Available" && donor.available) ||
        (status === "Unavailable" && !donor.available);

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [donors, search, group, status]);

  const toggleAvailability = async (id) => {
    try {
      const res = await api.patch(`/donors/${id}/toggle`);

      setDonors((prev) => prev.map((d) => (d.id === id ? res.data : d)));
    } catch (err) {
      console.error("Failed to toggle donor", err);
    }
  };

  if (loading) return <p>Loading donors...</p>;

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-3 md:px-6 lg:px-9 py-4 md:py-6 space-y-6 md:space-y-8 page-load-animation">
      {/* TOP */}
      <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between">
        <div>
          <h2 className="font-bold text-2xl md:text-3xl">Donors</h2>
          <p className="text-sm md:text-base text-gray-400">
            Manage registered blood donors
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="text-xs md:text-sm bg-green-200 py-1 px-2 rounded-lg text-green-600 flex gap-1 items-center">
            <Users size={14} className="md:w-4 md:h-4" />
            <p>{donors.length} total</p>
          </div>
          <div className="text-xs md:text-sm bg-blue-200 py-1 px-2 rounded-lg text-blue-600">
            <p>{donors.filter((d) => d.available).length} Available</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        group={group}
        setGroup={setGroup}
        status={status}
        setStatus={setStatus}
      />

      {/* TABLE HEADER */}
      <div className="hidden lg:grid grid-cols-6 gap-4 font-semibold text-gray-500 border-b pb-2 text-sm">
        <p>Donor</p>
        <p>Blood Group</p>
        <p>Contact</p>
        <p>Location</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      {/* LIST */}
      <div className="space-y-2 md:space-y-1 max-h-[90vh] overflow-y-auto">
        {filteredDonors.map((d) => (
          <DonorItem
            key={d.id}
            name={d.name}
            sex={d.gender}
            BG={d.bloodGroup}
            mail={d.email}
            phone={d.phone}
            location={d.city}
            status={d.available ? "Available" : "Unavailable"}
            icon={d.available ? CircleCheckBig : CircleX}
            onViewDetails={() => {
              setSelectedDonor(d);
              setIsModalOpen(true);
            }}
            onToggle={() => toggleAvailability(d.id)}
          />
        ))}
      </div>

      {/* Donor Detail Modal */}
      <DonorDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donor={selectedDonor}
      />
    </div>
  );
};

export default Donor;
