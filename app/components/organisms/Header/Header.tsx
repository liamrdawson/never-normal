import { LinksFunction } from "@remix-run/node";
import { Heading } from "~/components/atoms/Heading/Heading";
import { NavBar, links as navBarLinks } from "~/components/molecules/nav/nav";
import styles from "./header.css";

export const links: LinksFunction = () => [
  ...navBarLinks(),
  { rel: "stylesheet", href: styles },
];

function Header() {
  return (
    <header className="header">
      <Heading className="logo" as="h1">
        Never Normal
      </Heading>
      <NavBar />
    </header>
  );
}

export { Header };
