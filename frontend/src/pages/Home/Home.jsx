import Banner from "../../components/Home/Banner.jsx";
import BlogListing from "../../components/Home/BlogListing.jsx";

export default function Home() {
  return (
    <div>
      <Banner />
      <div className="max-w-7xl mx-auto">
        <BlogListing />
      </div>
    </div>
  );
}
