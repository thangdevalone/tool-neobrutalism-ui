import * as easing from "@/lib/easing";
import { useEffect, useRef, useState } from "react";
import { Wheel } from "spin-wheel";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
function WheelComponent({ wheelItem,setValue }) {
  const wheelContainer = useRef(null);
  const wheelInstance = useRef(null); // Ref to store the Wheel instance
  const [items, setItems] = useState([]);
  const [random, setRandom] = useState();
  const [openWin, setOpenWin] = useState(false);
  const winnerRef = useRef(null);
  const [colorArray, setColorArray] = useState();
  const [disable,setDisable]=useState(false)
  useEffect(() => {
    const lines = wheelItem
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      setDisable(true)
      setItems([""]);
      setColorArray(["#fff"]);
    }
    if (lines.length>0) {
      setDisable(false)

      const data_set = lines.map((item) => {
        return { label: item };
      });
      if ((data_set.length !== items.length)||data_set.length===1) {
        setColorArray(getRandomHexColors(lines.length));
      }
      setItems(data_set);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelItem]);
  function getRandomHexColors(count) {
    const generatedColors = new Set();

    while (generatedColors.size < count) {
      const hexColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      generatedColors.add(hexColor);
    }

    return Array.from(generatedColors);
  }
  useEffect(() => {
    if (wheelContainer.current) {
      if (!wheelInstance.current) {
        // Initialize the wheel instance if it does not already exist
        wheelInstance.current = new Wheel(wheelContainer.current, {
          items,
          radius: 0.89,
          lineWidth: 0,
          borderWidth: 0,
          isInteractive: false,
          itemLabelFontSizeMax: 20,
          itemLabelRadius: 0.97,
          itemLabelRadiusMax: 0.2,
          itemLabelRotation: 0,
          itemLabelColors: ["#fff"],
          pointerAngle: 90,
          itemBackgroundColors: colorArray,
          overlayImage: "./assets/wheel-overlay.svg",
        });
      } else {
        // Update the existing wheel instance with new items
        wheelInstance.current.items = items;
        wheelInstance.current.itemBackgroundColors = colorArray;
      }
    }
  }, [items, wheelItem, colorArray]);
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // Inclusive of min and max
  }
  const handleRole = () => {
    const ran = getRandomInt(0, items.length);
    setRandom(ran);
    if (wheelInstance?.current) {
      winnerRef.current = setTimeout(() => {
        setOpenWin(true);
      }, 7400);
      wheelInstance.current.spinToItem(
        ran,
        6000,
        true,
        6,
        1,
        easing.cubicInOut
      );
    }
  };
  useEffect(() => {
    return () => {
      if (winnerRef.current) {
        clearTimeout(winnerRef.current);
      }
    };
  }, [winnerRef]);
  const handleRemove=()=>{
    const val=items.splice(random, 1)
    setItems(val)
    setValue(val.join('\n'))
  }
  return (
    <div className="flex flex-col h-full w-full">
      <Dialog onOpenChange={setOpenWin} open={openWin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chúng ta đã có người chiến thắng!</DialogTitle>
            <p className="mb-0 text-2xl font-semibold">
              {random && items[random]?.label || "Không xác định"}
            </p>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" className="bg-white" variant="default">
                Đóng
              </Button>
            </DialogClose>
            <Button onClick={handleRemove} type="button" variant="default">
              Gỡ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
      >
        <Button disabled={disable} onClick={handleRole}>Quay</Button>
      </div>

      <div
        className={"w-full !font-wheel h-full relative"}
        ref={wheelContainer}
      ></div>
    </div>
  );
}

export default WheelComponent;
