import React from "react";

type Props = {};

const Aside = (props: Props) => {
  return (
    <aside className="scrollbar fixed top-[88px] h-[calc(100svh-88px)] max-h-[calc(100svh-88px)] w-[250px] overflow-y-auto border-r-4 border-black m800:w-[180px] m600:hidden">
      <nav></nav>
    </aside>
  );
};

export default Aside;
