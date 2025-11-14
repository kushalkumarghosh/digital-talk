import { useEffect, useState } from "react";
import BlogCards from "./BlogCards";
import Pagination from "../Pagination";
import CategorySelection from "./CategorySelection";
import SideBar from "../../layout/SideBar";
import api from "../../api/axios";

export default function BlogListing() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const categoryQuery = selectedCategory
          ? `&category=${encodeURIComponent(selectedCategory)}`
          : "";

        const { data } = await api.get(
          `/blogs?page=${currentPage}&limit=${pageSize}${categoryQuery}`
        );

        const items = (data?.items || []).map((b) => ({
          ...b,
          id: b.numericId || b._id,
        }));

        setBlogs(items);
        setTotalPages(data?.pages || 1);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      }
    }

    fetchBlogs();
  }, [currentPage, selectedCategory]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 my-12 mx-4">
      <div className="w-full lg:w-2/3">
        <CategorySelection
          onSelectCategory={handleCategorySelect}
          activeCategory={activeCategory}
        />
        <BlogCards blogs={blogs} />
        <div className="mt-6">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/3 mt-10">
        <SideBar />
      </div>
    </div>
  );
}
