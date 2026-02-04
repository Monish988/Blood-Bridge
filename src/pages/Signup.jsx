import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Mars, Venus } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    city: "",
    role: "donor",
    password: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Gender */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <Mars />
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={handleChange}
            />
          </label>

          <label className="flex items-center gap-2">
            <Venus />
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={handleChange}
            />
          </label>
        </div>

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="city"
          value={form.city}
          placeholder="City"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
        </select>

        {form.role === "donor" && (
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select Blood Group</option>
            {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white py-2 rounded w-full disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </div>
  );
};

export default SignUp;
