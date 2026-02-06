/**
 * Single source of truth for all recommended reading data.
 * Every article pulls from this file — update thumbnails here once,
 * and they're correct everywhere.
 */
var ALL_RECOMMENDED_ARTICLES = [
  {
    title: "Obada Baddest",
    slug: "obada-baddest",
    url: "/articles/obada-baddest/",
    date: "Feb 2026",
    author: "Zino Asamaige",
    image: "/articles/obada-baddest/og-image.jpg"
  },
  {
    title: "On Walking",
    slug: "on-walking",
    url: "/articles/on-walking/",
    date: "Jan 2026",
    author: "Zino Asamaige",
    image: "/articles/on-walking/image.jpg"
  },
  {
    title: "Why I\u2019m Building Accrue",
    slug: "why-im-building-accrue",
    url: "/articles/why-im-building-accrue/",
    date: "Jan 2026",
    author: "Zino Asamaige",
    image: "/articles/why-im-building-accrue/team.png"
  },
  {
    title: "The Friction Tax",
    slug: "the-friction-tax",
    url: "/articles/the-friction-tax/",
    date: "Dec 2025",
    author: "Zino Asamaige",
    image: "/articles/the-friction-tax/thumbnail.png"
  },
  {
    title: "Accrue\u2019s Big Day!",
    slug: "accrues-big-day",
    url: "/articles/accrues-big-day/",
    date: "Jan 2022",
    author: "Zino Asamaige",
    image: "/articles/accrues-big-day/image.png"
  },
  {
    title: "Happy 4th Birthday!",
    slug: "happy-4th-birthday",
    url: "https://adesuwa.substack.com/p/happy-4th-birthday",
    date: "Jan 2026",
    author: "Adesuwa Omoruyi",
    external: true,
    image: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe5750dcb-9f05-4d83-9918-b6fdbee62059_2076x1488.png"
  },
  {
    title: "Stablecoin Agents Will Onboard Billions",
    slug: "stablecoin-agents",
    url: "https://www.clintonmbah.com/posts/stablecoin_agents_will_onboard_billions_of_africans_to_the_global_economy.html",
    date: "2025",
    author: "Clinton Mbah",
    external: true,
    image: "https://www.clintonmbah.com/images/accrue_reviews.png"
  },
  {
    title: "When We Realized Our Startup Idea Wasn\u2019t Going to Work",
    slug: "startup-idea-not-working",
    url: "https://medium.com/@adesuwaomoruyi/when-we-realized-our-startup-idea-wasnt-going-to-work-100d45d2d280",
    date: "2024",
    author: "Adesuwa Omoruyi",
    external: true,
    image: "https://miro.medium.com/v2/resize:fit:1200/1*xw86UFPzKtmm02RlvK1Eug.png"
  }
];

/**
 * Get recommended articles for a given article slug.
 * Filters out the current article and returns up to `count` results.
 */
function getRecommendedArticles(currentSlug, count) {
  count = count || 4;
  return ALL_RECOMMENDED_ARTICLES.filter(function(a) {
    return a.slug !== currentSlug && !a.url.includes(currentSlug);
  }).slice(0, count);
}
