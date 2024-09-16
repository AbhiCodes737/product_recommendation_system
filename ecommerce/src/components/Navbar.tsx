"use client";

import Link from "next/link";
import { useState } from "react";
import { NavLink } from "./NavLink";
import CartBtn from "./CartBtn";

const links = [
  { url: "/", title: "Home" },
  { url: "/all-products", title: "All Products" },
  { url: "/categories", title: "Categories" },
];

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between px-4 py-2 bg-yellow-400 ">
      <div className="flex flex-row justify-start">
        {links.map((link) => (
          <NavLink link={link} key={link.url} />
        ))}
      </div>
      <div className="flex flex-row justify-end items-center">
        <NavLink link={{ url: "/account", title: "Account" }} />
        <Link href={"/cart"}><CartBtn/></Link>
      </div>
    </div>
  );
};

export default Navbar;
