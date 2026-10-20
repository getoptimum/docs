import { defineConfig } from 'vitepress'

const { BASE: base = "/" } = process.env;
const gateway = "https://getoptimum.github.io/optimum-gateway/versions/latest"
const withBase = (path: string) => `${base}${path.replace(/^\//, "")}`;

// Absolute, not withBase(): a scraper fetching the page has no base to resolve
// a relative og:image against, so a path-only value is silently dropped and the
// unfurl renders an empty frame. Same host as og:url and the sitemap.
const siteUrl = "https://docs.getoptimum.xyz";
const ogImage = `${siteUrl}/og-image.png`;

// The page's own absolute URL. og:url is the canonical identity of the thing
// being shared, so a single site-wide value makes every subpage announce itself
// as the home page and unfurl as it.
//
// The trailing slash is load-bearing and differs by page kind, because that is
// what the Worker's auto-trailing-slash handling serves: a directory index
// redirects /keysync -> /keysync/ (307), while a leaf redirects
// /accelerate/adjust-mev-boost/ -> no slash. Dropping it on index pages points
// the canonical at a URL that redirects. Stripping ".md" and a trailing "index"
// lands on the served form for both, and matches the sitemap exactly.
const pageUrl = (relativePath: string) =>
  `${siteUrl}/${relativePath.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1")}`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Optimum Docs",
  description: "Run an Optimum gateway, connect your validators, and read Signal and Accelerate in Console.",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  base: base,
  markdown: {
    math: true,
  },
  srcExclude: [
    "README.md"
  ],
  sitemap: {
    hostname: siteUrl,
  },

  // og:url, og:title and og:description are per page, so they cannot live in the
  // static head above. Without them a shared subpage identifies itself as the
  // home page, and the unfurl title carries the "| Optimum Docs" suffix that
  // titleTemplate adds for the browser tab.
  transformHead({ pageData, siteData }) {
    // not_found_handling serves 404.html for every unknown path, so a canonical
    // here would point each of them at /404 as if it were a real page.
    if (pageData.relativePath === "404.md" || pageData.isNotFound) return [];
    const url = pageUrl(pageData.relativePath);
    const title = pageData.frontmatter.title || pageData.title || siteData.title;
    const description =
      pageData.frontmatter.description || pageData.description || siteData.description;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { name: "twitter:url", content: url }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
    ];
  },
  head: [
    [
      "link",
      { rel: "icon", href: withBase("/favicons/favicon.svg"), type: "image/svg+xml" },
    ],
    ["link", { rel: "icon", href: withBase("/favicons/favicon-96x96.png"), type: "image/png" }],
    [
      "link",
      {
        rel: "shortcut icon",
        href: withBase("/favicons/favicon.ico"),
        type: "image/x-icon",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#fff" }],
    ["meta", { name: "theme-color", content: "#fff" }],
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],
    // No `property: "description"` here. `description` is a name meta, not an
    // RDFa property, and VitePress already emits the per-page one from
    // frontmatter -- so this added an invalid second description that contradicted
    // it on all 33 pages.
    ["meta", { httpEquiv: "Content-Language", content: "en" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@get_optimum" }],
    ["meta", { name: "twitter:site:domain", content: "docs.getoptimum.xyz" }],
    ["meta", { name: "twitter:image", content: ogImage }],
    ["meta", { name: "twitter:image:alt", content: "Optimum Documentation" }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Optimum Docs" }],
    // og:url is emitted per page by transformHead, not here.
    ["meta", { property: "og:image", content: ogImage }],
    // The three below describe that file; public/og-image.png is 1200x630 PNG.
    // They were already declared while og:image itself was commented out, which
    // is why the unfurl rendered a sized but empty frame.
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { property: "og:image:type", content: "image/png" }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      "/": sidebarHome(),
    },

    outline: {
      level: "deep",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },

    logo: {
      alt: "Optimum Logo",
      light: "/logo-light.png",
      dark: "/logo-dark.png",
    },

    siteTitle: false,

    socialLinks: [
      { icon: "github", link: "https://github.com/getoptimum/docs" },
      { icon: "x", link: "https://x.com/get_optimum" },
      { icon: "discord", link: "https://discord.gg/getoptimum" },
      // { icon: "youtube", link: "" },
      // { icon: { svg: telegramSVG }, link: "" },
    ],
  }
})

function nav() {
  return [
    { text: "Start", link: "/start/what-optimum-does" },
    { text: "Console", link: "https://console.getoptimum.xyz/" },
    { text: "Gateway", link: `${gateway}/` },
  ];
}

function sidebarHome() {
  return [
    {
      text: "Operator setup",
      collapsed: false,
      items: [
        {
          text: "Start here",
          collapsed: false,
          items: [
            { text: "Introduction", link: "/" },
            { text: "What Optimum does", link: "/start/what-optimum-does" },
            { text: "Choose a path", link: "/start/choose-a-path" },
            { text: "Before you begin", link: "/start/before-you-begin" },
          ],
        },
        {
          text: "Getting in",
          collapsed: false,
          items: [
            { text: "Create an account", link: "/getting-in/create-an-account" },
            { text: "Account type", link: "/getting-in/account-type" },
            { text: "Register", link: "/getting-in/register" },
          ],
        },
        {
          text: "Signal",
          collapsed: false,
          items: [
            { text: "What Signal does", link: "/signal/what-signal-does" },
            { text: "Network", link: "/signal/network" },
            { text: "Connect your gateway", link: "/signal/connect-your-gateway" },
            { text: "When the check fails", link: "/signal/when-the-check-fails" },
            { text: "Register keys", link: "/signal/register-keys" },
            { text: "Onboard in bulk", link: "/signal/onboard-in-bulk" },
            { text: "Your first report", link: "/signal/your-first-report" },
          ],
        },
        {
          text: "Accelerate",
          collapsed: false,
          items: [
            { text: "What Accelerate does", link: "/accelerate/what-accelerate-does" },
            { text: "Readiness", link: "/accelerate/readiness" },
            { text: "Recommendation", link: "/accelerate/recommendation" },
            { text: "MEV sidecar configuration", link: "/accelerate/adjust-mev-boost" },
            { text: "Acceleration", link: "/accelerate/where-results-show" },
          ],
        },
        {
          text: "Operate",
          collapsed: true,
          items: [
            { text: "Run the gateway", link: "/operate/run-the-gateway" },
            { text: "Kubernetes", link: "/operate/kubernetes" },
            { text: "Block stream", link: "/operate/block-stream" },
            { text: "Telemetry", link: "/operate/telemetry" },
          ],
        },
        {
          text: "Help",
          collapsed: true,
          items: [
            { text: "Troubleshoot", link: "/help/troubleshoot" },
            { text: "Support", link: "/help/support" },
            { text: "FAQ", link: "/help/faq" },
          ],
        },
      ],
    },
    {
      text: "Keysync",
      collapsed: false,
      items: [
        { text: "Sync validator keys", link: "/keysync/" },
      ],
    },
    {
      text: "General Optimum docs",
      collapsed: true,
      items: [
        { text: "mump2p protocol", link: "/docs/learn/overview/p2p" },
        { text: "Gossip", link: "/docs/research/gossip/gossip" },
        { text: "Transport", link: "/docs/research/gossip/transport" },
        { text: "Decentralized access", link: "/docs/research/gossip/decentralized-access" },
      ],
    },
    {
      text: "Gateway manual",
      collapsed: true,
      items: [
        { text: "Overview", link: `${gateway}/` },
        { text: "Quick start", link: `${gateway}/quick-start` },
        { text: "Connecting your CL client", link: `${gateway}/cl-clients` },
        { text: "Configuration", link: `${gateway}/configuration` },
        { text: "Kubernetes (Helm)", link: `${gateway}/kubernetes` },
        { text: "Troubleshooting", link: `${gateway}/troubleshoot` },
      ],
    },
  ]
}
