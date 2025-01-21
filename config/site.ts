export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cumorah",
  description: "Keep your valuable information hidden.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Credentials",
      href: "/credentials",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Credentials",
      href: "/credentials",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
    newCredential: "/credentials/new",
  },
};
