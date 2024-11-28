import {Badge} from "@/components/ui/badge";
import {SquareArrowOutUpRight} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className=" [background-size:16px_16px] ml-[250px] min-h-[100dvh] w-[full-250px] bg-bg px-5 pt-[88px] m800:ml-[180px] m800:w-[full-180px] m600:m-0 m600:w-full m500:pt-16">
      <div
        className="mx-auto w-[700px] py-20 leading-relaxed prose-h2:mb-8 prose-headings:font-heading prose-h2:text-2xl prose-h3:mb-6 prose-h3:text-xl prose-p:leading-7 prose-p:font-base prose-a:underline prose-a:font-heading prose-code:mx-1 prose-code:rounded-base prose-code:font-bold prose-code:border prose-code:border-black prose-code:bg-main prose-code:px-2 m1000:w-[500px] m750:w-[350px] m400:w-full m400:py-16 prose-h2:m400:text-xl prose-h3:m400:text-lg">
        <h2 className="text-2xl font-semibold mb-2">
          Giới thiệu phần mềm trò chơi "Name company"
        </h2>

        <p>
          Ghé thắm{" "}
          <Link href="#" target="_blank">
            "Name company"
          </Link>{" "}
          để biết thêm về chúng tôi.
        </p>
        <br/>

        <h2 className="text-2xl font-semibold mb-2">Tính năng mới</h2>

        <ul className="max-w-md space-y-1 text-gray-600 list-disc list-inside dark:text-gray-400">
          <li>Vòng quay may mắn <Badge className="ml-1 px-2"><Link href='/happy-wheel'
                                                                   className="flex gap-2 flex-row font-semibold items-center   hover:underline">Thử
            ngay! <SquareArrowOutUpRight size={16}/></Link></Badge></li>
          <li>Sắp tới còn cập nhật thêm bạn nhớ cập nhật!</li>
        </ul>
      </div>
    </div>
  );
}
