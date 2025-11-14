import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSquareFacebook,
  FaSquareDribbble,
  FaTwitter,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isLoggedIn = !!user;
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/", link: "Home" },
    { path: "/services", link: "Services" },
    { path: "/about", link: "About" },
    { path: "/blogs", link: "Blogs" },
    { path: "/contact", link: "Contact" },
  ];

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <nav className="px-4 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <NavLink
          to="/"
          className="text-xl font-bold text-zinc-500 no-underline"
        >
          Digital<span className="text-zinc-400">TALK</span>
        </NavLink>

        <ul className="md:flex gap-10 text-lg hidden">
          {navItems.map(({ path, link }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `hover:text-zinc-400 ${
                    isActive ? "text-zinc-300 border-b" : ""
                  }`
                }
              >
                {link}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="text-white flex gap-4 items-center">
          <a href="/" className="hover:text-zinc-400">
            <FaSquareFacebook />
          </a>
          <a href="/" className="hover:text-zinc-400">
            <FaSquareDribbble />
          </a>
          <a href="/" className="hover:text-zinc-400">
            <FaTwitter />
          </a>

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-zinc-500 px-6 py-2 font-medium rounded hover:bg-zinc-300 hover:text-zinc-800 transition-all duration-200 ease-in"
            >
              Log in
            </button>
          ) : (
            <>
              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-zinc-500 px-6 py-2 font-medium rounded hover:bg-zinc-300 hover:text-zinc-800 transition-all duration-200 ease-in"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-zinc-500 px-6 py-2 font-medium rounded hover:bg-zinc-300 hover:text-zinc-800 transition-all duration-200 ease-in"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaXmark className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-black text-white px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map(({ path, link }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 hover:text-zinc-400"
                >
                  {link}
                </NavLink>
              </li>
            ))}

            {!isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full mt-2 bg-zinc-500 px-4 py-2 rounded"
                >
                  Log in
                </button>
              </li>
            ) : (
              <>
                {role === "admin" && (
                  <li>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full mt-2 bg-zinc-700 px-4 py-2 rounded"
                    >
                      Dashboard
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full mt-2 border border-zinc-500 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
