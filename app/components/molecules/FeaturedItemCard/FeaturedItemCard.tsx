import { LinksFunction } from "@remix-run/node";
import { Heading } from "~/components/atoms/Heading/Heading";
import styles from "./featured-item-card.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export type FeaturedItem = {
  title: string;
  description: string;
  image: string;
  link?: string;
};

function FeaturedItemCard({ title, description, image }: FeaturedItem) {
  return (
    <div className="card">
      <div className="image-container">{image}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export { FeaturedItemCard };
