import { Droplets, CircleUser, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
const Left = () => {
  const { user, logout } = useAuth();
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
    user?.role === "hospital" && {
      id: 5,
      label: "Donors",
      path: "/dashboard/donors",
    },
    user?.role === "donor" && {
      id: 6,
      label: "My Profile",
      path: "/dashboard/donor-profile",
    },
  ].filter(Boolean);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-1/6 md:h-screen px-4 md:px-6 bg-white flex flex-col md:border-r border-gray-200">
      {/* TOP */}
      <div className="flex items-center gap-3 md:gap-4 py-3 md:py-6 border-b border-gray-200">
        <div className="shadow-xl text-white bg-red-500 p-2 md:p-3 rounded-2xl">
          <Droplets size={24} className="md:w-8 md:h-8" />
        </div>
        <div className="hidden md:block">
          <h3 className="text-xl md:text-2xl font-extrabold">Blood Bridge</h3>
          <p className="text-xs md:text-sm text-gray-500">Connecting Lives</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex md:flex-col px-2 md:px-4 gap-2 md:gap-4 py-3 md:py-6 flex-1 overflow-x-auto md:overflow-x-visible overflow-y-auto md:overflow-y-auto">
        {navItems.map(({ id, label, path }) => (
          <NavLink
            key={id}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `text-xs md:text-lg transition whitespace-nowrap md:whitespace-normal px-3 md:px-0 py-2 md:py-0 rounded md:rounded-none ${
                isActive
                  ? "text-red-500 font-semibold bg-red-50 md:bg-transparent"
                  : "text-gray-500 hover:text-red-500"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="bg-gray-100 flex items-center justify-between gap-2 md:gap-3 py-2 md:py-3 mb-2 md:mb-3 px-2 md:px-4 rounded-2xl">
        <div className="flex gap-2 md:gap-4 items-center min-w-0">
          <div className="bg-gray-900 text-white rounded-full p-1 flex-shrink-0">
            <CircleUser size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="hidden md:block min-w-0">
            <h4 className="font-semibold text-sm truncate">
              {user?.name || "User"}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "email"}
            </p>
          </div>
        </div>

        <LogOut
          className="text-gray-400 cursor-pointer hover:text-red-500 flex-shrink-0"
          size={20}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

export default Left;
