import { LinksFunction } from "@remix-run/node";
import { Heading } from "~/components/atoms/Heading/Heading";
import styles from "./serviceCard.css";
import {
  FeaturedItemsGrid,
  links as featuredItemsGridStyles,
} from "~/components/organisms/FeaturedItemsGrid/FeaturedItemsGrid";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  ...featuredItemsGridStyles(),
];

const services = [
  {
    title: "Shopify Theme Development",
    description: "Custom builds, theme customizations, app integrations & backend configuration.",
    image: "image src",
  },
  {
    title: "Theme Customisation",
    description:
      "Strategy, app integrations, custom built, performant storefronts & backend configuration.",
    image: "image src",
  },
  {
    title: "Strategy & Planning",
    description: "Consulting on strategy, content, and scaling your eCommerce business.",
    image: "image src",
  },
  {
    title: "Website Auditing",
    description:
      "Strategy, app integrations, custom built, performant storefronts & backend configuration.",
    image: "image src",
  },
  {
    title: "Conversion Rate Optimisation",
    description:
      "Strategy, app integrations, custom built, performant storefronts & backend configuration.",
    image: "image src",
  },
  {
    title: "Store Setup & Migration",
    description:
      "Strategy, app integrations, custom built, performant storefronts & backend configuration.",
    image: "image src",
  },
];

function ServicesSection() {
  return (
    <section className="services-section">
      <div className="callout-grid">
        <strong className="services-callout">
          Your website is the heart of your brand. I’m here to ensure you get the best results from
          each and every visitor. Here’s how I can supercharge your business and grow your sales.
        </strong>
      </div>
      <Heading as="h2">Our Services</Heading>
      <FeaturedItemsGrid featuredItems={services} />
    </section>
  );
}

export { ServicesSection };
