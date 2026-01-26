import React, { useEffect, useState } from "react";
import RightCard from "./RightCard";
import api from "../../services/api";
import { useLocation } from "react-router-dom";
import {
  Users,
  Activity,
  Droplet,
  CircleAlert,
  Building2,
  Clock,
} from "lucide-react";

const Right = () => {
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
    <div className="flex-1 bg-gray-100 px-4 min-h-screen sm:px-6 lg:px-9 py-6 space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="font-bold text-3xl">Dashboard</h2>
        <p className="text-base text-gray-400">
          Real-time overview of blood bank operations
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white p-5 rounded-lg space-y-4">
        <div className="flex items-center gap-3">
          <CircleAlert size={22} className="text-red-500" />
          <h2 className="font-bold text-lg">Recent Blood Requests</h2>
        </div>

        {requests.slice(0, 3).map((r) => (
          <div
            key={r.id}
            className="bg-gray-100 p-4 rounded-lg space-y-2"
          >
            <div className="flex gap-3 items-center">
              <h2 className="text-red-500 font-bold text-2xl">
                {r.bloodGroup}
              </h2>

              <span className="px-2 py-1 text-sm rounded bg-amber-50 text-amber-600">
                {r.urgency}
              </span>

              <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-600">
                {r.status}
              </span>
            </div>

            <div className="flex gap-2 text-sm text-gray-500 items-center">
              <Building2 size={16} />
              <p>{r.hospital}</p>
            </div>

            <div className="flex gap-4 text-sm text-gray-500 items-center">
              <p>{r.units} units needed</p>
              <div className="flex gap-1 items-center">
                <Clock size={14} />
                <p>{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-sm text-gray-400">No active requests</p>
        )}
      </div>
    </div>
  );
};

export default Right;
