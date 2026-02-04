import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

const RequestModal = ({ open, onClose, onCreated }) => {
  const [hospitals, setHospitals] = useState([]);

  const [form, setForm] = useState({
    hospitalId: "",
    bloodGroup: "",
    urgency: "Medium",
    units: 1,
    phone: "",
    patientName: "",
    reason: "",
  });

  // Fetch hospitals when modal opens
  useEffect(() => {
    if (!open) return;

    api.get("/hospitals").then((res) => {
      setHospitals(res.data);
    });
  }, [open]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createRequest = async () => {
    if (!form.hospitalId || !form.bloodGroup) {
      return alert("Hospital and blood group are required");
    }

    try {
      const payload = {
        hospitalId: Number(form.hospitalId),
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        urgency: form.urgency.toUpperCase(),
        phone: form.phone,
        patientName: form.patientName,
        reason: form.reason,
      };

      const res = await api.post("/requests", payload);

      onCreated?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create request");
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-xl p-6 space-y-5"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">New Blood Request</h2>
            <p className="text-gray-400 text-sm">
              Create an emergency blood request
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Hospital */}
          <div>
            <label className="text-sm font-medium">
              Hospital <span className="text-red-500">*</span>
            </label>
            <select
              name="hospitalId"
              value={form.hospitalId}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Urgency</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          {/* Units & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="units"
              min="1"
              value={form.units}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder="Units"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Emergency contact"
              className="border rounded p-2"
            />
          </div>

          {/* Patient */}
          <input
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            placeholder="Patient name (optional)"
            className="border rounded p-2 w-full"
          />

          {/* Reason */}
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason"
            rows={3}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={createRequest}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
          >
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
