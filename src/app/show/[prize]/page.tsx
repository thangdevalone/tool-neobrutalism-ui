"use client";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useStore} from "@/store/history";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {Award} from "lucide-react";

const padStt = (stt: number): string => stt.toString().padStart(3, "0");

const defaultImage = "/assets/def.png";

export default function Page({params}: { params: { prize: string } }) {
  const {prizes} = useStore();
  const router = useRouter();

  const [filteredPrizes, setFilteredPrizes] = useState<any>([]);
  useEffect(() => {
    setFilteredPrizes(prizes.filter((prize: any) => prize.prize === decodeURIComponent(params.prize)))
  }, [prizes, decodeURIComponent(params.prize)]);
  const [images, setImages] = useState<Record<string, string>>({});
  const cacheRef = useRef<Record<string, string>>({}); // Lưu cache ở đây

  const checkImageExists = async (src: string): Promise<boolean> => {
    try {
      const response = await fetch(src, {method: "HEAD"});
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkImages = async () => {
      const results: Record<string, string> = {...images};

      for (const prize of filteredPrizes) {
        const sttKey = padStt(prize.stt);

        // Nếu đã có trong cache, bỏ qua kiểm tra
        if (cacheRef.current[sttKey]) {
          results[sttKey] = cacheRef.current[sttKey];
          continue;
        }

        // Kiểm tra ảnh nếu chưa có trong cache
        const imgSrc = `/assets/mobi-data/${sttKey}.jpg`;
        const exists = await checkImageExists(imgSrc);
        const finalSrc = exists ? imgSrc : defaultImage;

        // Cập nhật cache
        cacheRef.current[sttKey] = finalSrc;
        results[sttKey] = finalSrc;
      }

      setImages(results);
    };

    if (filteredPrizes.length > 0) {
      checkImages();
    }
  }, [filteredPrizes]);

  return (
    <div
      className="w-[calc(100vw_-_400px)] [background-size:16px_16px] ml-[400px] h-[100dvh] sm:px-0 bg-bg px-5 py-[88px] md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full overflow-y-auto sm:pt-16">
      <div className="p-4">
        <Button onClick={() => router.push("/")} className="mb-4">
          Quay lại
        </Button>
        <h1 className="text-2xl font-semibold mb-4">Danh sách người trúng: {decodeURIComponent(params.prize)}</h1>
        {filteredPrizes.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredPrizes.map((prize: any) => (
              <div key={prize.stt} className="flex flex-row items-center gap-2 border-b py-2">
                <img
                  className="w-[100px] rounded-xl aspect-square object-center"
                  src={images[padStt(prize.stt)] || defaultImage}
                  alt="avt"
                />
                <Award size={16}/>
                <p>
                  {prize.fullName} - {prize.position} - {prize.luckyNumber} (
                  {format(prize.date, "PP HH:mm:ss")})
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có người trúng giải nào.</p>
        )}
      </div>
    </div>
  );
}
