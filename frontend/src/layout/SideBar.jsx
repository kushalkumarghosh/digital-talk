import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function SideBar() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/blogs?limit=5&page=1");
        setLatest(data.items || []);
      } catch (e) {
        console.error("Failed to load latest blogs", e);
      }
    })();
  }, []);

  return (
    <aside className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-3">Latest Blogs</h3>
      <ul className="space-y-3">
        {latest.map((b) => (
          <li key={b._id} className="border-b pb-3">
            <Link
              to={`/blogs/${b._id}`}
              className="font-medium hover:text-zinc-500"
            >
              {b.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {b.excerpt?.slice(0, 100) || ""}
              {b.excerpt && b.excerpt.length > 100 ? "…" : ""}
            </p>
            <Link
              to={`/blogs/${b._id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Read More
            </Link>
          </li>
        ))}
        {latest.length === 0 && (
          <li className="text-sm text-gray-500">No blogs yet.</li>
        )}
      </ul>
    </aside>
  );
}
