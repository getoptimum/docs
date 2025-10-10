import { defineConfig } from 'vitepress'

const { BASE: base = "/" } = process.env;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Optimum Docs",
  description: "The world's first high-performance memory infrastructure for any blockchain.",
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

  transformHead: (cfg) => {
    const abcDiaBold = cfg.assets.find(() => /ABCDiatype-Bold\.\w+\.woff2/);
    const abcDiaLight = cfg.assets.find(() => /ABCDiatype-Light\.\w+\.woff2/);

    if (abcDiaBold) {
      cfg.head.push(
        [
          'link',
          {
            rel: 'preload',
            href: abcDiaBold,
            as: 'font',
            type: 'font/woff2',
            crossorigin: ''
          }
        ]
      );
    }

    if (abcDiaLight) {
      cfg.head.push(
        [
          'link',
          {
            rel: 'preload',
            href: abcDiaLight,
            as: 'font',
            type: 'font/woff2',
            crossorigin: ''
          }
        ]
      );
    }
  },

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
      { icon: "discord", link: "https://discord.gg/7EwFpu79cZ" },
      // { icon: "youtube", link: "" },
      // { icon: { svg: telegramSVG }, link: "" },
    ],
  }
})

function nav() {
  return [
    {
      text: "Menu",
      items: [
        // { text: "Get Started", link: "/docs/how-to-guides/overview" },
        { text: "Learn", link: "/docs/learn/overview/intro" },
        {
          text: "Resources",
          items: [
            // {
            //   text: "Optimum Improvement Proposals (OIPs)",
            //   link: "https://docs.getoptimum.xyz/", // TODO: Update link once live.
            // },
            {
              text: "Optimum ADRs",
              link: "https://github.com/getoptimum/optimum/tree/main/docs/architecture#adr-table-of-contents",
            },
            // {
            //   text: "Flexnode API Docs",
            //   link: "https://docs.getoptimum.xyz/", // TODO: Update link once live.
            // },
          ],
        },
      ],
    },
  ];
}

function sidebarHome() {
  return [
    {
      text: "Overview of Optimum",
      collapsed: false,
      items: [
        {
          text: "Introduction",
          link: "/docs/learn/overview/intro",
        },
        {
          text: "mumP2P Protocol",
          link: "/docs/learn/overview/p2p.md",
        },
        {
          text: "Optimum DeRAM",
          link: "/docs/learn/overview/deram.md",
        },
      ],
    },
    {
      text: "Getting Started",
      collapsed: false,
      items: [
        {
          text: "Quick Start",
          link: "/docs/guides/overview",
        },
        {
          text: "HOP Testing Suite",
          link: "https://getoptimum.github.io/optimum-hop/",
        },
        {
          text: "Optimum Gateway",
          link: "https://getoptimum.github.io/optimum-gateway/versions/v0.0.1-rc6/",
        },
        {
          text: "Getting Started with CLI",
          link: "/docs/guides/01-getting-started-cli",
        },
        {
          text: "Getting Started with Docker",
          link: "/docs/guides/02-getting-started-docker",
        },
        {
          text: "Understanding Key Parameters",
          link: "/docs/guides/03-parameters",
        },
        {
          text: "Common Experiments",
          link: "/docs/guides/04-experiments",
        },
        {
          text: "FAQ",
          link: "/docs/guides/05-faq-glossary",
        },
      ],
    },
    {
      text: "Research",
      collapsed: false,
      items: [
        {
          text: "mumP2P Protocol",
          collapsed: true,
          items: [
            {
              text: "Gossip",
              link: "/docs/research/gossip/gossip",
            },
            {
              text: "Transport",
              link: "/docs/research/gossip/transport",
            },
            {
              text: "Decentralized Access",
              link: "/docs/research/gossip/decentralized-access",
            }
          ]
        },
        {
          text: "Optimum DeRAM",
          collapsed: true,
          items: [
            {
              text: "Atomicity and Consistency",
              link: "/docs/research/deram/atomicity-consistency",
            },
            {
              text: "Decentralized Data Storage",
              link: "/docs/research/deram/decentralized-storage",
            }
          ]
        }
      ],
    },
  ]
}
