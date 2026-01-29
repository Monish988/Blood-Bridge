import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { RequestItem } from "./RequestItem";
import RequestModal from "./RequestModal";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [active, setActive] = useState("Pending");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/api/requests").then((res) => setRequests(res.data));
  }, []);

  const filtered = useMemo(() => {
    if (active === "All") return requests;
    if (active === "Pending")
      return requests.filter((r) => r.status === "OPEN");
    if (active === "Fulfilled")
      return requests.filter((r) => r.status === "FULFILLED");
    if (active === "Cancelled")
      return requests.filter((r) => r.status === "CANCELLED");
  }, [active, requests]);

  const markFulfilled = async (id) => {
    const res = await api.patch(`/api/requests/${id}`, {
      status: "FULFILLED",
    });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? res.data : r))
    );
  };

  const cancelRequest = async (id) => {
    const res = await api.patch(`/api/requests/${id}`, {
      status: "CANCELLED",
    });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? res.data : r))
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-3 md:px-6 py-4 md:py-6 space-y-6 md:space-y-10 page-load-animation">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
        <div>
          <h2 className="font-bold text-2xl md:text-3xl">Blood Requests</h2>
          <p className="text-sm md:text-base text-gray-400">
            Manage emergency blood requests
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-3 md:px-5 py-2 rounded-lg hover:bg-red-700 text-sm md:text-base"
        >
          <Plus size={16} className="md:w-4.5 md:h-4.5" />
          New Request
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-1 md:gap-2 bg-gray-200 p-1 rounded-xl w-fit overflow-x-auto">
        {["All", "Pending", "Fulfilled", "Cancelled"].map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-base whitespace-nowrap ${
              active === t
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-2 md:space-y-4">
        {filtered.map((r) => (
          <RequestItem
            key={r.id}
            data={r}
            onFulfill={() => markFulfilled(r.id)}
            onCancel={() => cancelRequest(r.id)}
          />
        ))}
      </div>

      {/* MODAL */}
      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(newRequest) => {
          setRequests((prev) => [newRequest, ...prev]);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default Request;
