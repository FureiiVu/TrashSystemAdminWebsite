import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UsersPage from "./pages/admin/UserPage";    
import PointsPage from "./pages/admin/TrashPage";
import RewardsPage from "./pages/admin/RewardsPage";
import { Sidebar } from "./components/admin/Sidebar";

type Tab = "users" | "points" | "rewards";

// Layout dùng chung cho mọi trang admin
function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // map pathname -> tab
  const pathToTab: Record<string, Tab> = {
    "/admin/users": "users",
    "/admin/points": "points",
    "/admin/rewards": "rewards",
  };

  const [activeTab, setActiveTab] = useState<Tab>("users");

  // cập nhật activeTab khi URL thay đổi (vd: user gõ tay URL)
  useEffect(() => {
    const tab = pathToTab[location.pathname];
    if (tab) setActiveTab(tab);
  }, [location.pathname]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-[#3333CC]">
            Website Admin Dashboard
          </h1>
        </div>
      </div>
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="flex-1 p-6">
          {/* nơi render các trang con */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Nhóm route /admin dùng chung AdminLayout (=> luôn có Sidebar) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="points" element={<PointsPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        {/* /admin -> /admin/users */}
        <Route index element={<Navigate to="users" replace />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
}
