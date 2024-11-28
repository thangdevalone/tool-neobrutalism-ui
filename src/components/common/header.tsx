import React from "react";
import Logo from "@/app/logo.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
type Props = {};

const Header = (props: Props) => {
  return (
    <header>
      <nav className="fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-black bg-white px-5 md:h-16 ">
        <div className="mx-auto h-full flex w-[1300px] max-w-full items-center justify-between">
          <Link href="/" className="h-[90%]  w-auto">
            <Image
              className="h-[100%]  w-auto"
              priority={true}
              src={Logo}
              alt="logo"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
