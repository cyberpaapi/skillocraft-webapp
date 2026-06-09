import HeroBlog from "@/components/blogs/Hero";
import BlogLatest from "@/components/blogs/LatestBlog";
import CategoryBlog from "@/components/blogs/Category";
import BlogLoved from "@/components/blogs/LovedBlog";

export default function Success() {
  return (
    <>
      <HeroBlog />
      <BlogLatest />
      <CategoryBlog />
      <BlogLoved />
    </>
  );
}
