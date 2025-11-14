import { useState } from "react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      const { data } = await api.post("/auth/forgot", { email });
      setMsg(
        data.message || "If that email exists, a reset link has been sent."
      );
    } catch (e) {
      setErr(e.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="border rounded w-full p-2"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-black text-white py-2 rounded w-full hover:bg-gray-800">
          Send Reset Link
        </button>
      </form>
      {msg && <p className="text-green-600 mt-4">{msg}</p>}
      {err && <p className="text-red-600 mt-4">{err}</p>}
    </div>
  );
}
