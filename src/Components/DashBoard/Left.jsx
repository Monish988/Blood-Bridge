import { Droplets, CircleUser, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect,useState } from "react";
import api from "../../services/api";
const Left = () => {
  const { user, logout } = useAuth();
  const [isDonorRegistered, setIsDonorRegistered] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 1, label: "Dashboard", path: "/dashboard" },
    user?.role === "hospital" && {
      id: 2,
      label: "Inventory",
      path: "/dashboard/inventory",
    },
    user?.role === "hospital" && {
      id: 3,
      label: "Requests",
      path: "/dashboard/requests",
    },
    user?.role === "hospital" && {
      id: 4,
      label: "Hospitals",
      path: "/dashboard/hospitals",
    },
    { id: 5, label: "Donors", path: "/dashboard/donors" },
   user?.role === "donor" &&
localStorage.getItem("donorRegistered") !== "true" && {
  id: 6,
  label: "Register",
  path: "/dashboard/register-donor",
},

  ].filter(Boolean);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full lg:w-1/6 h-screen px-6 bg-white flex flex-col">
      {/* TOP */}
      <div className="flex items-center gap-4 py-6 border-b border-gray-200">
        <div className="shadow-xl text-white bg-red-500 p-3 rounded-2xl">
          <Droplets size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">Blood Bridge</h3>
          <p className="text-sm text-gray-500">Connecting Lives</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col px-4 gap-4 py-6 flex-1 overflow-y-auto">
        {navItems.map(({ id, label, path }) => (
          <NavLink
            key={id}   // ✅ FIXED KEY WARNING
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `text-lg transition ${
                isActive
                  ? "text-red-500 font-semibold"
                  : "text-gray-500 hover:text-red-500"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="bg-gray-100 flex items-center justify-between gap-3 py-3 mb-3 px-4 rounded-2xl">
        <div className="flex gap-4 items-center">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <CircleUser size={28} />
          </div>
          <div>
            <h4 className="font-semibold">
              {user?.name || "User"}
            </h4>
            <p className="text-xs text-gray-400">
              {user?.email || "email"}
            </p>
          </div>
        </div>

        <LogOut
          className="text-gray-400 cursor-pointer hover:text-red-500"
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

export default Left;
