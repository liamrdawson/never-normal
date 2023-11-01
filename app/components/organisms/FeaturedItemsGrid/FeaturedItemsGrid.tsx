import { LinksFunction } from "@remix-run/node";
import {
  FeaturedItemCard,
  FeaturedItem,
  links as featuredItemCardStyles,
} from "~/components/molecules/FeaturedItemCard/FeaturedItemCard";
import styles from "./featured-items-grid.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...featuredItemCardStyles(),
];

type FeaturedItems = {
  featuredItems: FeaturedItem[];
};

function FeaturedItemsGrid({ featuredItems }: FeaturedItems) {
  return (
    <div className="grid">
      {featuredItems.map((item) => (
        <FeaturedItemCard
          key={item.title}
          title={item.title}
          description={item.description}
          image={item.image}
        />
      ))}
    </div>
  );
}

export { FeaturedItemsGrid };
