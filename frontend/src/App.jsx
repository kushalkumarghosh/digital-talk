import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
