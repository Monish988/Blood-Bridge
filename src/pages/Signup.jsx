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
    role: "donor", // default
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/auth/signup", form);
      
      // If user signed up as donor, redirect to donor registration
      if (form.role === "donor") {
        sessionStorage.setItem("pendingDonorRegistration", "true");
        navigate("/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="bg-white mt-80 flex h-150 w-220 mx-auto shadow-xl rounded-3xl overflow-hidden">
      {/* LEFT */}
      <div className="w-2/5 bg-red-400 flex flex-col items-center gap-10 p-4">
        <img
          className="rounded-full w-40 h-40 mt-30"
          src="https://images.unsplash.com/vector-1765556333702-1f3ee7241f8f?w=700"
        />
        <h3 className="font-extrabold text-3xl text-white">
          Let's get you set up
        </h3>
        <CircleChevronRight color="#fff" size={52} />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-6 mx-auto p-16">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2"
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

        <button
          onClick={handleSubmit}
          className="bg-black text-white py-2 rounded"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignUp;
