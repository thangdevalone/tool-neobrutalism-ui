import Link from "next/link";
import React from "react";

type Props = {};

const NavLink = [
  {
    name: "Vòng quay may mắn",
    link: "/happy-wheel",
  },
];

const Aside = (props: Props) => {
  return (
    <aside className="scrollbar fixed top-[88px] h-[calc(100svh_-_88px)] max-h-[calc(100svh_-_88px)] w-[250px] overflow-y-auto border-r-4 border-black md:w-[180px] sm:hidden">
      <nav>
        {NavLink.map((item) => {
          return (
            <Link
              key={item.link}
              href={item.link}
              className=" block border-b-4 border-r-4 border-black p-4 pl-7 text-lg font-base text-black/90 hover:bg-accent m800:p-4 m800:pl-6 m800:text-base"
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Aside;
