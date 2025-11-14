import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);

  async function load() {
    const { data } = await api.get("/auth");
    setUsers(data);
  }

  async function del(id) {
    if (window.confirm("Delete this user?")) {
      await api.delete(`/auth/${id}`);
      load();
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border capitalize">{u.role}</td>
              <td className="p-2 border text-center">
                {u.role !== "admin" && (
                  <button
                    onClick={() => del(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
