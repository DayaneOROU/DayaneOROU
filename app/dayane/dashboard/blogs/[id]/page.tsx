import { notFound } from "next/navigation"; // renvoie la page 404
import BlogForm from "@/components/blog-form";
import { getBlogById } from "@/lib/actions/blogs";

// Page de modification : /dayane/dashboard/blogs/<id>
// Dans Next.js 16, params est une promesse : on l'attend
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let blog = null;
  try {
    blog = await getBlogById(id); // lit l'article (lève une erreur si l'id est invalide)
  } catch {
    notFound(); // id mal formé → 404
  }
  if (!blog) notFound(); // article introuvable → 404

  return <BlogForm blog={blog} />; // formulaire en mode modification
}