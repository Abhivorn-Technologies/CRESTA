export const siteConfig = {
  name: "Cresta Global Private Limited",
  shortName: "Cresta Global",
  tagline: "Delivering Joy, One Scoop at a Time.",
  description:
    "Cresta Global Private Limited is an authorized distributor of Baskin Robbins ice cream, delivering premium ice cream products across the region.",
  distributorOf: "Baskin Robbins",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 9000199047",
  email: "crestaglobalpvtltd@gmail.com",
  address: "Aparna Neo Mall, Nallagandla, Hyderabad",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Delivery", href: "/delivery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const footerLinks: { title: string; links: NavLink[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Delivery Options", href: "/delivery" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
      { label: "Order Tracking", href: "/orders" },
      { label: "Login", href: "/login" },
    ],
  },
];
