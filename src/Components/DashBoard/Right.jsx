import React, { useEffect, useState } from "react";
import RightCard from "./RightCard";
import api from "../../services/api";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Activity,
  Droplet,
  CircleAlert,
  Building2,
  Clock,
  Heart,
} from "lucide-react";

const Right = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);

  const location = useLocation();

useEffect(() => {
  const fetchData = async () => {
    const statsRes = await api.get("/api/stats");
    const requestsRes = await api.get("/api/requests");

    setStats(statsRes.data);
    setRequests(requestsRes.data);
  };

  fetchData();
}, [location.pathname]);

  if (!stats) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 bg-gray-100 px-3 md:px-6 lg:px-9 min-h-screen py-4 md:py-6 space-y-6 md:space-y-8 page-load-animation">
      {/* HEADER */}
      <div>
        <h2 className="font-bold text-2xl md:text-3xl">Dashboard</h2>
        <p className="text-sm md:text-base text-gray-400">
          {user?.role === "donor" 
            ? "Welcome back, donor! Help save lives today"
            : "Real-time overview of blood bank operations"}
        </p>
      </div>

      {/* DONOR QUICK ACTION - Contact Requests Button */}
      {user?.role === "donor" && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 md:p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg md:text-xl">Help Save Lives</h3>
                <p className="text-xs md:text-sm text-red-100">Click on any request below to express your interest</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <RightCard
          title="Total Donors"
          count={stats.totalDonors}
          icon={Users}
          color="bg-red-500"
        />
        <RightCard
          title="Active Donors"
          count={stats.availableDonors}
          icon={Activity}
          color="bg-green-500"
        />
        <RightCard
          title="Total Requests"
          count={requests.length}
          icon={Droplet}
          color="bg-blue-500"
        />
        <RightCard
          title="Pending Requests"
          count={stats.activeRequests}
          icon={CircleAlert}
          color="bg-yellow-500"
        />
      </div>

      {/* RECENT REQUESTS */}
      <div className="bg-white p-3 md:p-5 rounded-lg space-y-4">
        <div className="flex items-center gap-3">
          <CircleAlert size={20} className="text-red-500" />
          <h2 className="font-bold text-base md:text-lg">Recent Blood Requests</h2>
        </div>

        {requests.slice(0, 3).map((r) => (
          <div
            key={r.id}
            className="bg-gray-100 p-3 md:p-4 rounded-lg space-y-2"
          >
            <div className="flex flex-wrap gap-2 md:gap-3 items-center">
              <h2 className="text-red-500 font-bold text-xl md:text-2xl">
                {r.bloodGroup}
              </h2>

              <span className={`px-2 py-1 text-xs md:text-sm rounded font-semibold ${
                r.urgency === "HIGH"
                  ? "bg-red-100 text-red-600"
                  : r.urgency === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600"
              }`}>
                {r.urgency}
              </span>

              <span className={`px-2 py-1 text-xs md:text-sm rounded font-semibold ${
                r.status === "OPEN" 
                  ? "bg-red-100 text-red-600" 
                  : r.status === "FULFILLED"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {r.status}
              </span>
            </div>

            <div className="flex gap-2 text-xs md:text-sm text-gray-500 items-center">
              <Building2 size={16} />
              <p className="truncate">{r.hospital}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-xs md:text-sm text-gray-500 items-start md:items-center">
              <p>{r.units} units needed</p>
              <div className="flex gap-1 items-center">
                <Clock size={14} />
                <p className="truncate">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Button for Donors */}
            {user?.role === "donor" && (
              <div className="pt-2 border-t">
                <a
                  href={`https://wa.me/${r.phone}?text=Hi%20${encodeURIComponent(r.hospital)},%20I%20am%20interested%20in%20donating%20${r.bloodGroup}%20blood%20for%20your%20request%20of%20${r.units}%20units.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-1 md:py-2 rounded transition font-semibold inline-flex items-center gap-2"
                >
                  <Heart size={14} className="md:w-4 md:h-4" />
                  Contact Hospital
                </a>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-xs md:text-sm text-gray-400">No active requests</p>
        )}
      </div>
    </div>
  );
};

export default Right;
