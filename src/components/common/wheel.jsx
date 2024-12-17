"use client"
import * as easing from "@/lib/easing";
import React, {useEffect, useRef, useState} from "react";
import {Wheel} from "spin-wheel";
import {Button} from "../ui/button";
import Logo from "@/app/images/logo_min.jpg";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "../ui/dialog";
import Image from "next/image";
import {useStore} from "@/store/history";
import useEmployeeStore from "@/store/employee-store";
import {cn, formatStringNumber} from "@/lib/utils";
import ReactConfetti from "react-confetti";
import useWindowSize from "@/hooks/use-window-size";

function WheelComponent({wheelItem, setValue, isAuto = false, prize, setPrize, setIsAuto}) {
  const wheelContainer = useRef(null);
  const wheelInstance = useRef(null);
  const {addPrize, setNowPrize, nowPrize} = useStore()
  const [items, setItems] = useState([]);
  const [random, setRandom] = useState(getRandomInt(0, items.length));
  const [openWin, setOpenWin] = useState(false);
  const winnerRef = useRef(null);
  const [colorArray, setColorArray] = useState();
  const [disable, setDisable] = useState(false);
  const [roling, setRoling] = useState(false);
  const [winner, setWinner] = useState(undefined);
  const {employees, removeEmployee} = useEmployeeStore()
  useEffect(() => {
    if (wheelItem.length === 0) {
      setDisable(true);
      setItems([""]);
      setColorArray(["#fff"]);
    }
    if (wheelItem.length > 0) {
      setDisable(false);

      const data_set = wheelItem.map((item) => {
        return {label: item};
      });
      if (data_set.length !== items.length || data_set.length === 1) {
        setColorArray(getRandomHexColors(wheelItem.length));
      }
      setItems(data_set);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelItem]);

  function getRandomHexColors(count) {
    const fixedColors = ["#FD9745", "#FFDC58", "#ff6b6b", "#9e66ff"];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(fixedColors[i % fixedColors.length]);
    }
    return colors;
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
          itemLabelFontSizeMax: 25,
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleRole = () => {
    if (roling === false && items.length >= 1) {
      if (isAuto) {
        if (!prize.find(item => item.quantity > 0)) return;
      }
      const ran = getRandomInt(0, items.length - 1);
      setRoling(true);
      setRandom(ran)
      if (wheelInstance?.current || wheelInstance?.current?.spinToItem) {
        if (!isAuto && !prize.find(item => item.quantity > 0)) {
          winnerRef.current = setTimeout(() => {
            setOpenWin(true);
            setRoling(false);
          }, 7400);
        } else {
          // setTimeout(() => {
          //   removeNow(ran);
          // }, 9900);
        }
        setTimeout(() => {
          setOpenWin(false);
        }, 11000);
        setTimeout(() => {
          setRoling(false);
        }, 11000);
        setTimeout(() => {
          const getPrize = prize.find(item => item.quantity > 0)
          const empDep = employees
            .filter(emp => emp.department === items[ran]?.label)
          const ranEmp = Math.floor(Math.random() * empDep.length);
          setWinner(empDep[ranEmp])
          setTimeout(() => {
            setOpenWin(false);
            removeEmployee(empDep[ranEmp]?.id)
          }, 11000);
          setOpenWin(true);
          if (getPrize) {
            addPrize({
              name: empDep[ranEmp]?.fullName + " - " + empDep[ranEmp]?.department,
              prize: getPrize.name,
              date: new Date()
            })
            setPrize([...prize].map((item) => item.id === getPrize.id ? ({
              ...item,
              quantity: item.quantity - 1
            }) : item));
          } else {
            setIsAuto(false);
          }
        }, 6000)
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

    const handler = () => {
      if (isAuto && !roling && prize.find(item => item.quantity > 0)) {
        if (prize) {
          const getPrize = prize.find(item => item.quantity > 0)
          if (getPrize) {
            if (nowPrize.length === 0 || nowPrize !== getPrize.name) {
              setNowPrize(getPrize.name)
            } else if (getPrize.quantity === 1) {
              setTimeout(() => {
                setIsAuto(false);
                setNowPrize("");
              }, 5500)
            }
          } else {
            setNowPrize("")
          }
        }
        handleRole();
      }
    }
    handler()
    if (!isAuto) {
      setNowPrize("");

    }

  }, [isAuto, roling]);


  useEffect(() => {
    return () => {
      if (winnerRef.current) {
        clearTimeout(winnerRef.current);
      }
    };
  }, [winnerRef]);
  const removeNow = (ran) => {
    const val = items.filter((_, index) => index !== ran);
    setItems(val);
    setValue(val.map((item) => item.label).join("\n"));
  }
  const handleRemove = () => {
    const val = items.filter((_, index) => index !== random);
    setOpenWin(false);
    setTimeout(() => {
      setItems(val);
      setValue(val.map((item) => item.label).join("\n"));
    }, 350);
  };
  const {width, height} = useWindowSize()
  return (
    <div className="flex flex-col h-full w-full">
      <div className={cn(openWin ? "block" : "hidden", "fixed z-[200] top-0 left-0")}>
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={300}
        />
      </div>
      <Dialog onOpenChange={setOpenWin} open={openWin}>
        <DialogContent className="max-w-3xl" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
          <DialogHeader>
            <DialogTitle className="text-xl">Chúng ta đã có người chiến thắng!</DialogTitle>
          </DialogHeader>
          <>
            {random !== null && items[random]?.label && winner && (
              <div className="flex w-full flex-col items-center gap-3 justify-center">
                <Image className="rounded-2xl object-cover"
                       src={`/assets/mobi-data/${formatStringNumber(winner?.stt)}.png`}
                       width={500} height={500}
                       alt={"avt"}/>
                <p className="text-3xl font-semibold">{winner.fullName}</p>
                <p className="text-lg text-muted-foreground">{winner.department}</p>
                <p className="text-xl">Giải thưởng : <strong>{nowPrize}</strong></p>
              </div>
            )}
            <p className="">Auto close after 4s</p>
          </>
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
                    ? wheelInstance.current._actualRadius * 0.3
                    : 0
                }px`,
                height: `${
                  wheelInstance.current
                    ? wheelInstance.current._actualRadius * 0.3
                    : 0
                }px`,
                borderRadius: "1000px",
              }}
              onClick={handleRole}
            >
              <Image
                className="h-[80%] object-cover w-auto select-none cursor-pointer"
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
