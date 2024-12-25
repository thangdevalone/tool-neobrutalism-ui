"use client";
import React from "react";
import {useStore} from "@/store/history";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {Award, Eye, Trash} from "lucide-react";
import {useRouter} from "next/navigation";

const groupPrizesByPrize = (prizes: any) => {
  return prizes.reduce((acc: any, prize: any) => {
    const prizeName = prize.prize || "null";
    if (!acc[prizeName]) {
      acc[prizeName] = [];
    }
    acc[prizeName].push(prize);
    return acc;
  }, {});
};

const Aside = () => {
  const {prizes, clearStore, removePrize} = useStore();

  const groupedPrizes = groupPrizesByPrize(prizes);
  const router = useRouter()

  return (
    <aside
      className="scrollbar fixed top-[88px] h-[calc(100svh_-_88px)] max-h-[calc(100svh_-_88px)] w-[400px] overflow-y-auto border-r-4 border-black md:w-[180px] sm:hidden"
    >
      <p className="font-semibold text-2xl text-center border-b py-3 border-black">Lịch sử vòng quay</p>
      <div className="py-3 px-4" onClick={() => clearStore()}>
        <Button>Xoá tất cả lịch sử</Button>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-3">
        {Object.entries(groupedPrizes).map(([prizeName, prizeList]) => (
          <div key={prizeName}>
            <div className="flex flex-row gap-2 items-center"><p
              className="font-semibold text-lg py-2">Giải: {prizeName}</p> <Eye className="cursor-pointer" onClick={()=>router.push(`/show/${prizeName}`)}/>
            </div>
            <div className="pl-4">
              {(prizeList as any).map((prize: any) => (
                <div className="flex flex-row gap-2 items-center" key={prize.stt}>
                  <Award size={16}/>
                  <p>{prize.luckyNumber} - ({format(prize.date, "PP HH:mm:ss")})</p>
                  <button
                    onClick={() => removePrize(prize.stt)}
                    className="ml-auto"
                  >
                    <Trash size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Aside;
