import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Optimum Docs",
  description: "The world's first high-performance memory infrastructure for any blockchain.",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  // base: base,
  markdown: {
    math: true,
  },
  sitemap: {
    hostname: "https://docs.getoptimum.xyz",
  },
  head: [
    [
      "link",
      { rel: "icon", href: "/favicons/favicon.svg", type: "image/svg+xml" },
    ],
    ["link", { rel: "icon", href: "/favicons/favicon-96x96.png", type: "image/png" }],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "/favicons/favicon.ico",
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
    [
      "meta",
      {
        property: "description",
        content: "The world's first high-performance memory infrastructure for any blockchain.",
      },
    ],
    ["meta", { httpEquiv: "Content-Language", content: "en" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@get_optimum" }],
    ["meta", { name: "twitter:site:domain", content: "docs.getoptimum.xyz" }],
    ["meta", { name: "twitter:url", content: "https://docs.getoptimum.xyz" }],
    // [
    //   "meta",
    //   {
    //     name: "twitter:image",
    //     content: "",
    //   },
    // ],
    ["meta", { name: "twitter:image:alt", content: "Optimum Documentation" }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Optimum Docs" }],
    ["meta", { property: "og:url", content: "https://docs.getoptimum.xyz" }],
    // [
    //   "meta",
    //   {
    //     property: "og:image",
    //     content: "",
    //   },
    // ],
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
      { icon: 'github', link: 'https://github.com/getoptimum/docs' },
      { icon: 'twitter', link: 'https://x.com/get_optimum' }
      // { icon: "youtube", link: "" },
      // { icon: "discord", link: "" },
      // { icon: { svg: telegramSVG }, link: "" },
    ]
  }
})

function nav() {
  return [
    {
      text: "Join the network",
      items: [
        { text: "Learn", link: "/how-to-guides/overview" },
        { text: "Quick Start", link: "/learn/overview/intro" },
        {
          text: "Resources",
          items: [
            {
              text: "Optimum Improvement Proposals (OIPs)",
              link: "https://docs.getoptimum.xyz/", // TODO: Update link once live.
            },
            {
              text: "Optimum ADRs",
              link: "https://github.com/getoptimum/optimum/tree/main/docs/architecture#adr-table-of-contents",
            },
            {
              text: "Flexnode API Docs",
              link: "https://docs.getoptimum.xyz/", // TODO: Update link once live.
            },
          ],
        },
      ],
    },
  ];
}

function sidebarHome() {
  return [
    {
      text: "Learn",
      collapsed: true,
      items: [
        {
          text: "Overview of Optimum",
          collapsed: true,
          items: [
            {
              text: "Introduction",
              link: "/learn/overview/intro",
            },
          ],
        },
        {
          text: "OPT",
          collapsed: true,
          items: [
          ],
        },
      ],
    },
    {
      text: "How-to Guides",
      collapsed: true,
      items: [],
    },
    {
      text: "Resources",
      collapsed: true,
      items: [],
    },
  ]
}
