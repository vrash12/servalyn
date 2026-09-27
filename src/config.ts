// Company details. Empty values are hidden on the page instead of becoming broken links.
// SEO tags, structured data, sitemap.xml and robots.txt are generated from these at build time.
export const site = {
  name: "Servalyn",
  url: "https://servalyn.com", // Placeholder — confirm before launch. No trailing slash.
  domain: "servalyn.com", // Placeholder — confirm before launch.
  email: "info@servalyn.com", // Placeholder — confirm before launch.
  phone: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  privacyUrl: "",
  termsUrl: "",
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || "",
  seo: {
    title: "Servalyn — Web Design, Custom Software, Mobile Apps, Automation & AI",
    description:
      "Servalyn is a digital studio that designs and builds fast, SEO-ready websites, custom web applications, mobile apps, business automation, and practical AI solutions.",
    shareTitle: "Servalyn — Software that pounces.",
    shareDescription:
      "Websites, custom software, mobile apps, automation, and AI — built with precision.",
    locale: "en_US",
    themeColor: "#f2ede3",
  },
};
