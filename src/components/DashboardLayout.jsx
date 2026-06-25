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
  const FM = {
    orange: "#ff9e3d",
    orangeDark: "#f86f26",
    orangePale: "#fff4e8",
    orangeBorder: "#ffbc54",

    text: "#2a1a08",
    textMuted: "#aa8661",

    bg: "#ffffff",
    bgSoft: "#ffffff",

    border: "#ede0d0",
    borderLight: "#f5ece0",
  };
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
    <div style={{ background: FM.bgSoft }} className="flex h-screen">
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300`}
        style={{
          background: FM.bg,
          borderRight: `1px solid ${FM.border}`,
          width: collapsed ? 60 : 260,
        }}
      >
        {/* LOGO */}
        <div
          className="flex items-center justify-between h-20 px-4"
          style={{
            borderBottom: `1px solid ${FM.border}`,
            background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
          }}
        >
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
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition group"
              style={{
                background: isActive(item.path) ? FM.orangePale : "transparent",
                color: isActive(item.path) ? FM.orangeDark : FM.text,
                border: isActive(item.path)
                  ? `1px solid ${FM.orangeBorder}`
                  : "1px solid transparent",
              }}
            >
              <item.icon size={20} />

              {!collapsed && <span>{item.label}</span>}

              {collapsed && (
                <span
                  style={{
                    position: "absolute",
                    left: 70,
                    background: FM.text,
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    opacity: 0,
                  }}
                  className="group-hover:opacity-100"
                >
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
          {/* overlay */}
          <div
            className="fixed inset-0"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => setSidebarOpen(false)}
          />

          {/* sidebar */}
          <aside
            className="fixed top-0 left-0 h-full shadow-lg flex flex-col"
            style={{
              width: 260,
              background: FM.bg,
              borderRight: `1px solid ${FM.border}`,
            }}
          >
            {/* header */}
            <div
              className="flex justify-between items-center px-4 h-16"
              style={{
                background: `linear-gradient(135deg, ${FM.orange}, ${FM.orangeDark})`,
                color: "#fff",
              }}
            >
              <span style={{ fontWeight: 600 }}>Menu</span>

              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            {/* menu */}
            <nav className="p-3 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition"
                  style={{
                    background: isActive(item.path)
                      ? FM.orangePale
                      : "transparent",
                    color: isActive(item.path) ? FM.orangeDark : FM.text,
                    border: isActive(item.path)
                      ? `1px solid ${FM.orangeBorder}`
                      : "1px solid transparent",
                  }}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* footer (perfil rápido) */}
            <div
              style={{
                marginTop: "auto",
                borderTop: `1px solid ${FM.border}`,
                padding: 12,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: FM.orange,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {getInitials(user?.name || "")}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: FM.text }}
                  >
                    {user?.name || "Usuário"}
                  </div>
                </div>

                <button onClick={handleLogout} style={{ color: FM.orangeDark }}>
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-8"
          style={{
            background: FM.bg,
            borderBottom: `1px solid ${FM.border}`,
          }}
        >
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>

          <h1 style={{ color: FM.text, fontWeight: 600 }}>
            {" "}
            {menuItems.find((item) => isActive(item.path))?.label ||
              "Dashboard"}
          </h1>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: FM.orange,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {" "}
                {getInitials(user?.name || "")}
              </div>

              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || "Usuário"}{" "}
              </span>
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
                style={{
                  background: FM.bg,
                  border: `1px solid ${FM.border}`,
                }}
              >
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard/perfil");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm"
                  style={{ color: FM.text }}
                >
                  <User size={16} />
                  Meu Perfil
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm"
                  style={{ color: FM.red }}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main
          className="flex-1 overflow-auto p-4 lg:p-8"
          style={{ background: FM.bgSoft }}
        >
          {" "}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
