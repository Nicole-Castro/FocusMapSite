import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  History,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/pacientes", icon: Users, label: "Pacientes" },
    { path: "/dashboard/historico-sessoes", icon: History, label: "Sessões" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        console.log("USER:", data);
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300
        ${collapsed ? "w-15" : "w-64"}`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between h-20 border-b bg-gradient-to-r from-primary-500 to-primary-600 px-4">
          {!collapsed && (
            <img
              src="/images/logo2.png"
              alt="Logo"
              className="h-32 object-contain"
            />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition group
              ${
                isActive(item.path)
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />

              {!collapsed && <span>{item.label}</span>}

              {/* Tooltip quando colapsado */}
              {collapsed && (
                <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
            <div className="flex justify-between items-center p-4 bg-primary-500 text-white">
              <span>Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100"
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>

          <h1 className="font-semibold text-gray-800">
            {menuItems.find((item) => isActive(item.path))?.label ||
              "Dashboard"}
          </h1>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                {getInitials(user?.name || "")}
              </div>

              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || "Usuário"}{" "}
              </span>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard/perfil");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  <User size={16} />
                  Meu Perfil
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
