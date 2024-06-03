import * as easing from "@/lib/easing";
import { useEffect, useRef, useState } from "react";
import { Wheel } from "spin-wheel";
import { Button } from "../ui/button";
import Logo from "@/app/logo.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
function WheelComponent({ wheelItem, setValue }) {
  const wheelContainer = useRef(null);
  const wheelInstance = useRef(null); // Ref to store the Wheel instance
  const [items, setItems] = useState([]);
  const [random, setRandom] = useState(getRandomInt(0, items.length));
  const [openWin, setOpenWin] = useState(false);
  const winnerRef = useRef(null);
  const [colorArray, setColorArray] = useState();
  const [disable, setDisable] = useState(false);
  const [roling, setRoling] = useState(false);
  useEffect(() => {
    if (wheelItem.length === 0) {
      setDisable(true);
      setItems([""]);
      setColorArray(["#fff"]);
    }
    if (wheelItem.length > 0) {
      setDisable(false);

      const data_set = wheelItem.map((item) => {
        return { label: item };
      });
      if (data_set.length !== items.length || data_set.length === 1) {
        setColorArray(getRandomHexColors(wheelItem.length));
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
  }, [items, colorArray]);
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // Inclusive of min and max
  }
  const handleRole = () => {
    if (roling == false) {
      const ran = getRandomInt(0, items.length - 1);
      setRandom(ran);
      setRoling(true);
      if (wheelInstance?.current || wheelInstance?.current?.spinToItem) {
        winnerRef.current = setTimeout(() => {
          setOpenWin(true);
          setRoling(false);
        }, 7400);
        wheelInstance.current?.spinToItem(
          ran,
          6000,
          false,
          6,
          1,
          easing.cubicOut
        );
      }
    }
  };
  useEffect(() => {
    return () => {
      if (winnerRef.current) {
        clearTimeout(winnerRef.current);
      }
    };
  }, [winnerRef]);
  const handleRemove = () => {
    const val = items.filter((_, index) => index !== random);
    setOpenWin(false);
    setTimeout(() => {
      setItems(val);
      setValue(val.map((item) => item.label).join("\n"));
    }, 350);
  };
  console.log(items[random]?.label,random)
  return (
    <div className="flex flex-col h-full w-full">
      <Dialog onOpenChange={setOpenWin} open={openWin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chúng ta đã có người chiến thắng!</DialogTitle>
            <p className="mb-0 text-2xl font-semibold">
              {(random!==null && items[random]?.label) || "Không xác định"}
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
        className={"w-full !font-wheel h-full relative"}
        ref={wheelContainer}
      >
        <div className="absolute top-[50%] left-[50%] z-10 -translate-x-1/2  -translate-y-1/2">
          {wheelInstance.current ? (
            <Button
              className="!bg-white"
              disabled={disable}
              style={{
                width: `${
                  wheelInstance.current
                    ? wheelInstance.current._actualRadius * 0.28
                    : 0
                }px`,
                height: `${
                  wheelInstance.current
                    ? wheelInstance.current._actualRadius * 0.28
                    : 0
                }px`,
                borderRadius: "1000px",
              }}
              onClick={handleRole}
            >
              <Image
                className="h-[100%]  w-auto select-none cursor-pointer"
                priority={true}
                src={Logo}
                alt="logo"
              />
            </Button>
          ) : (
            "Đang tải..."
          )}
        </div>
      </div>
    </div>
  );
}

export default WheelComponent;
