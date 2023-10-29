import type { LinksFunction } from "@remix-run/node";
import styles from "./button.css";
import { ReactNode } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

type ButtonInput = {
  name?: string;
  value?: string;
  type: "submit" | "reset" | "button";
  variant: "text" | "contained" | "outlined";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  isInverse: boolean;
};

export function Button({
  children,
  name = "",
  value = "",
  type = "button",
  onClick,
  variant,
  isInverse,
}: ButtonInput) {
  return (
    <button
      className={`base variant-${variant}${isInverse ? "-inverse" : ""}`}
      name={name}
      value={value}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
