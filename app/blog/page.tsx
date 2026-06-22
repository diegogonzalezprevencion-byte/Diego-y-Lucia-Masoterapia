import Link from "next/link";
import { posts } from "../../lib/blog";

export const metadata = {
  title: "Blog de Masoterapia y Bienestar",
  description: "Artículos sobre masoterapia, relajación, bienestar corporal y autocuidado."
};

export default function Blog() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">Blog de bienestar</div>
          <h1>Blog de Masoterapia y Bienestar</h1>
          <p>Contenido educativo sobre relajación, autocuidado y bienestar corporal.</p>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {posts.map((post) => (
              <Link className="card" href={`/blog/${post.slug}`} key={post.slug}>
                <span className="badge">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
