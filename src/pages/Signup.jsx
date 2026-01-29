import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Mars, Venus, CircleChevronRight } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    city: "",
    role: "donor", // default
    password: "",
    bloodGroup: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/api/auth/signup", form);
      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="bg-white flex flex-col md:flex-row md:h-150 md:w-220 md:mt-80 mx-auto shadow-xl rounded-3xl overflow-hidden min-h-screen md:min-h-auto">
      {/* LEFT */}
      <div className="md:w-2/5 bg-red-400 flex flex-col items-center gap-6 md:gap-10 p-4 py-8 md:py-0 justify-center">
        <img
          className="rounded-full w-32 h-32 md:w-40 md:h-40"
          src="https://images.unsplash.com/vector-1765556333702-1f3ee7241f8f?w=700"
        />
        <h3 className="font-extrabold text-2xl md:text-3xl text-white text-center">
          Let's get you set up
        </h3>
        <CircleChevronRight color="#fff" size={52} className="hidden md:block" />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 md:gap-6 mx-auto p-6 md:p-16 w-full md:flex-1">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 text-sm"
        />

        {/* Gender */}
        <div className="flex gap-6">
          <label className="flex gap-2 items-center">
            <Mars />
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={handleChange}
            />
          </label>

          <label className="flex gap-2 items-center">
            <Venus />
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
            />
          </label>
        </div>

        <input type="date" name="dob" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <select name="role" onChange={handleChange}>
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
        </select>

        {/* Blood Group - Only for Donors */}
        {form.role === "donor" && (
          <select name="bloodGroup" onChange={handleChange}>
            <option value="">Select Blood Group</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        )}

        <button
          onClick={handleSubmit}
          className="bg-black text-white py-2 rounded text-sm md:text-base"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignUp;
