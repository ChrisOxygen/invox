import clsx from "clsx";
import Link from "next/link";
import { LiaFileInvoiceSolid } from "react-icons/lia";

type LogoProps = {
  color?: "white" | "black";
  rootLink?: string;
};

function Logo({ color, rootLink = "/dashboard" }: LogoProps) {
  return (
    <Link
      href={rootLink}
      className={clsx("flex gap-2 items-center", {
        "text-white": color === "white",
        "text-black": color === "black",
      })}
    >
      <span className=" text-2xl">
        <LiaFileInvoiceSolid />
      </span>
      <span className="text-2xl  font-bold">Invox</span>
    </Link>
  );
}

export default Logo;
