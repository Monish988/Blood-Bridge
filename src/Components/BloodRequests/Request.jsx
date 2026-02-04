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
    api.get("/requests").then((res) => setRequests(res.data));
  }, []);

  const filtered = useMemo(() => {
    if (active === "All") return requests;
    if (active === "Pending") return requests.filter(r => r.status === "OPEN");
    if (active === "Fulfilled") return requests.filter(r => r.status === "FULFILLED");
    if (active === "Cancelled") return requests.filter(r => r.status === "CANCELLED");
    return [];
  }, [active, requests]);

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/requests/${id}`, { status });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? res.data : r))
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-3xl">Blood Requests</h2>
          <p className="text-gray-400">Manage emergency blood requests</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-gray-200 p-1 rounded-xl w-fit">
        {["All", "Pending", "Fulfilled", "Cancelled"].map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-lg ${
              active === t ? "bg-white shadow" : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <RequestItem
            key={r.id}
            data={r}
            onFulfill={() => updateStatus(r.id, "FULFILLED")}
            onCancel={() => updateStatus(r.id, "CANCELLED")}
          />
        ))}
      </div>

      {/* MODAL */}
      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(req) => setRequests((prev) => [req, ...prev])}
      />
    </div>
  );
};

export default Request;
