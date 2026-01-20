// ========= ARTICLES DATA =========
// Add new articles here. Newest first.
// 
// Required fields:
// - slug: URL-friendly identifier (used in /articles/[slug]/)
// - title: Article title
// - excerpt: Short description (shown on listing page)
// - date: Publication date (ISO format: YYYY-MM-DD)
// - author: Author name
// 
// Optional fields:
// - thumbnail: Path to thumbnail image (for social sharing & listing)
// - tags: Array of tags
// - readTime: Estimated read time (e.g., "5 min read")

const ARTICLES = [
  {
    slug: "my-first-post",
    title: "My First Post",
    excerpt: "This is my first post on this blog. Just testing things out and seeing how it all works.",
    date: "2026-01-15",
    author: "Zino Asamaige",
    thumbnail: "/articles/assets/thumbnails/first-post.jpg",
    tags: ["personal", "thoughts"],
    readTime: "3 min read"
  },
  // Add more articles here...
  // {
  //   slug: "article-slug",
  //   title: "Article Title",
  //   excerpt: "Brief description of the article...",
  //   date: "2026-01-20",
  //   author: "Zino Asamaige",
  //   thumbnail: "/articles/assets/thumbnails/image.jpg",
  //   tags: ["tag1", "tag2"],
  //   readTime: "5 min read"
  // },
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARTICLES;
}
