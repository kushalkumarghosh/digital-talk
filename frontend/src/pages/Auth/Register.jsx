import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/register", { name, email, password });
      nav("/login");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registration
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleRegister} className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <button className="bg-black text-white rounded py-2 hover:bg-gray-800">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
