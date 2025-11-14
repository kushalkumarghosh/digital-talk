import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);

      const savedRedirect = sessionStorage.getItem("postLoginRedirect");
      if (savedRedirect) {
        sessionStorage.removeItem("postLoginRedirect");
        nav(savedRedirect, { replace: true });
        return;
      }

      if (data.role === "admin") {
        nav("/admin", { replace: true });
      } else {
        nav("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.msg ||
        err.message ||
        "Login failed. Please try again.";
      setError(msg);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 pt-20">
      <div className="bg-white shadow-lg p-8 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="grid gap-4">
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
            Sign In
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
