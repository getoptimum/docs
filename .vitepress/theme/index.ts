// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from 'vitepress/theme-without-fonts';
import "./style.css";
import "./fonts.css";
import LLMDropdown from '../components/LLMDropdown.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'nav-bar-content-after': () => h(LLMDropdown),
    });
  },
  enhanceApp({ app, router, siteData }) {
    // Register global components
    app.component('LLMDropdown', LLMDropdown);
  },
} satisfies Theme;
