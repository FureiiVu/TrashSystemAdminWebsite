// src/components/admin/Sidebar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Tab = "users" | "points" | "rewards";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-[calc(100vh-64px)] bg-white border-r">
      <nav className="flex flex-col">
        <div
          onClick={() => {
            onTabChange("users");
            navigate("/admin/users");
          }}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeTab === "users"
              ? "bg-[#3333CC] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          1. Quản lý người dùng
        </div>

        <div
          onClick={() => {
            onTabChange("points");
            navigate("/admin/points");
          }}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeTab === "points"
              ? "bg-[#3333CC] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          2. Quản lý thùng rác
        </div>

        <div
          onClick={() => {
            onTabChange("rewards");
            navigate("/admin/rewards");
          }}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeTab === "rewards"
              ? "bg-[#3333CC] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          3. Quản lý phần thưởng
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 mx-6 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
        >
          Đăng xuất
        </button>
      </nav>
    </div>
  );
};
