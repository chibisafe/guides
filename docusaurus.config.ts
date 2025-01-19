import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: "chibisafe",
	tagline: "Blazing fast file vault written in TypeScript! 🚀",
	favicon: "img/favicon.ico",

	// Set the production url of your site here
	url: "https://chibisafe.app",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/guides/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "chibisafe", // Usually your GitHub org/user name.
	projectName: "guides", // Usually your repo name.
	deploymentBranch: "gh-pages",
	trailingSlash: false,

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: "https://github.com/chibisafe/docs/tree/main/",
				},
				blog: {
					showReadingTime: true,
					feedOptions: {
						type: ["rss", "atom"],
						xslt: true,
					},
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					// editUrl:
					// 	"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
					// Useful options to enforce blogging best practices
					onInlineTags: "warn",
					onInlineAuthors: "warn",
					onUntruncatedBlogPosts: "warn",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/og.jpg",
		navbar: {
			title: "chibisafe",
			logo: {
				alt: "chibisafe logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "tutorialSidebar",
					position: "left",
					label: "documentation",
				},
				// { to: "/blog", label: "Blog", position: "left" },
				{
					href: "https://github.com/chibisafe/chibisafe",
					label: "GitHub",
					position: "right",
				},
				{
					label: "Discord",
					href: "https://discord.gg/5g6vgwn",
					position: "right",
				},
				{
					label: "Patreon",
					href: "https://patreon.com/pitu",
					position: "right",
				},
			],
		},
		// footer: {
		// 	style: "dark",
		// 	links: [
		// 		{
		// 			title: "Guides",
		// 			items: [
		// 				{
		// 					label: "Guides",
		// 					to: "/docs/intro",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			title: "Community",
		// 			items: [
		// 				{
		// 					label: "Discord",
		// 					href: "https://discord.gg/5g6vgwn",
		// 				},
		// 				{
		// 					label: "GitHub",
		// 					href: "https://github.com/chibisafe/chibisafe",
		// 				},
		// 				{
		// 					label: "Patreon",
		// 					href: "https://patreon.com/pitu",
		// 				},
		// 			],
		// 		},
		// 		// {
		// 		// 	title: "More",
		// 		// 	items: [
		// 		// 		{
		// 		// 			label: "Blog",
		// 		// 			to: "/blog",
		// 		// 		},
		// 		// 		{
		// 		// 			label: "GitHub",
		// 		// 			href: "https://github.com/facebook/docusaurus",
		// 		// 		},
		// 		// 	],
		// 		// },
		// 	],
		// 	// copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
		// },
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.oneDark,
			additionalLanguages: ["bash", "yaml", "nginx"],
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
