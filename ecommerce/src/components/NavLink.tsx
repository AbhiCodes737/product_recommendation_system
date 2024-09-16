"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  link: {
    url: string,
    title: string
  }
};

function NavLink({ link }: NavLinkProps) {
  const pathName: string = usePathname()
  return <Link className={`p-2 ${pathName === link.url && "text-yellow-800 font-bold"}`} href={link.url}>{link.title}</Link>;
}

export { NavLink };