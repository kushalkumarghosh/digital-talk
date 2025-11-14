import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 10) {
      return setErr("Password must be at least 10 characters");
    }
    if (password !== confirm) {
      return setErr("Passwords do not match");
    }

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMsg(data.message || data.msg || "Password updated.");

      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          e.response?.data?.msg ||
          "Invalid or expired link"
      );
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-10 px-4">Invalid reset link.</div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Set a new password</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="border rounded w-full p-2"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="border rounded w-full p-2"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button className="bg-black text-white rounded py-2 hover:bg-gray-800 w-full">
          Update Password
        </button>
      </form>
      {msg && <p className="text-green-600 mt-4">{msg}</p>}
      {err && <p className="text-red-600 mt-4">{err}</p>}
    </div>
  );
}
