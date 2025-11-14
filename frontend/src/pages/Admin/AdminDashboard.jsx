import { useState } from "react";
import Dashboard from "../../components/Admin/Dashboard";
import BlogManager from "../../components/Admin/BlogManager";
import UserManager from "../../components/Admin/UserManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </header>

      <nav className="flex bg-gray-200 p-4 gap-4 justify-center">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded ${
            activeTab === "dashboard" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 rounded ${
            activeTab === "blogs" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Manage Blogs
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Manage Users
        </button>
      </nav>

      <main className="p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "blogs" && <BlogManager />}
        {activeTab === "users" && <UserManager />}
      </main>
    </div>
  );
}
