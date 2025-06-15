const articles = [
  {
    title: "How to Barter Skills Effectively",
    excerpt: "Learn negotiation strategies for fair swaps",
    tag: "Tips"
  },
  {
    title: "Top In-Demand Skills for 2023",
    excerpt: "See what skills people are requesting most",
    tag: "Trends"
  }
];

export default function BlogPreview() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">From Our Blog</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6 bg-white">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full mb-3">
                  {article.tag}
                </span>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link
                  to={`/blog/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}