import type { LinksFunction } from "@remix-run/node";
import { Heading } from "~/components/atoms/Heading/Heading";
import styles from "./hero.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  headerCopy: string;
};

function Header({ headerCopy }: Props) {
  return (
    <div className="hero">
      <Heading className={"headerCopy"}>{headerCopy}</Heading>
    </div>
  );
}

export { Header };
