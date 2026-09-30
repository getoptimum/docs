import { defineConfig } from 'vitepress'

const { BASE: base = "/" } = process.env;
const withBase = (path: string) => `${base}${path.replace(/^\//, "")}`;

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
    hostname: "https://docs.getoptimum.xyz",
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
    [
      "meta",
      {
        property: "description",
        content: "Run an Optimum gateway, connect your validators, and read Signal and Accelerate in Console.",
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
      { icon: "github", link: "https://github.com/getoptimum/docs" },
      { icon: "x", link: "https://x.com/get_optimum" },
      { icon: "discord", link: "https://discord.gg/getoptimum" },
      // { icon: "youtube", link: "" },
      // { icon: { svg: telegramSVG }, link: "" },
    ],
  }
})

const gateway = "https://getoptimum.github.io/optimum-gateway/versions/latest"

function nav() {
  return [
    { text: "Start", link: "/start/what-optimum-does" },
    { text: "Console", link: "https://console.getoptimum.io/" },
    { text: "Gateway", link: `${gateway}/` },
  ];
}

function sidebarHome() {
  return [
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
        { text: "Region", link: "/getting-in/region" },
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
        { text: "Adjust MEV-Boost", link: "/accelerate/adjust-mev-boost" },
        { text: "Where results show", link: "/accelerate/where-results-show" },
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
      text: "Reference",
      collapsed: true,
      items: [
        { text: "On this site", link: "/reference/" },
        { text: "Gateway docs", link: `${gateway}/` },
        { text: "Configuration", link: `${gateway}/configuration` },
        { text: "Self-enrollment", link: `${gateway}/gateway-self-enrollment` },
        { text: "Block stream", link: `${gateway}/block-stream` },
        { text: "Metrics", link: `${gateway}/metrics` },
        { text: "Metrics methodology", link: `${gateway}/metrics-methodology` },
        { text: "Release notes", link: `${gateway}/release-notes` },
        {
          text: "Security audit",
          link: "https://cdn.probelab.io/media/documents/2026-08-ProbeLab-Security_Audit_Report_Optimum_Gateway.pdf",
        },
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
    {
      text: "Learn",
      collapsed: true,
      items: [
        { text: "mump2p protocol", link: "/docs/learn/overview/p2p" },
        { text: "Gossip", link: "/docs/research/gossip/gossip" },
        { text: "Transport", link: "/docs/research/gossip/transport" },
        { text: "Decentralized access", link: "/docs/research/gossip/decentralized-access" },
      ],
    },
  ]
}
