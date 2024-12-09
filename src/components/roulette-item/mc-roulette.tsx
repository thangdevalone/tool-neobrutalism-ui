import React, {useRef, useState} from 'react';
import cl from "./roulette.module.scss"
import {Roulette, weaponAttributes} from "@/models/roulette";
import RouletteItem from "@/components/roulette-item/roulette-item";
import {Button} from "@/components/ui/button";
import {useStore} from "@/store/history";
import useDialogStore from "@/store/dialog-jackpot";
import {Dialog, DialogContent, DialogFooter} from "@/components/ui/dialog";

interface RouletteElementParams {
  weapons: weaponAttributes[],
  weaponsCount: number,
  transitionDuration: number
}

const McRoulette = ({
                      weapons,
                      weaponsCount,
                      transitionDuration
                    }: RouletteElementParams) => {

  const [rouletteWeapons, setRouletteWeapons] = useState<weaponAttributes[]>(weapons)
  const [weaponPrizeId, setWeaponPrizeId] = useState<number>(-1)
  const [isReplay, setIsReplay] = useState<boolean>(false)
  const [isSpin, setIsSpin] = useState<boolean>(false)
  const [isSpinEnd, setIsSpinEnd] = useState<boolean>(false)
  const [winHistory, setWinHistory] = useState<weaponAttributes[]>([])

  const rouletteContainerRef = useRef<HTMLDivElement>(null)
  const weaponsRef = useRef<HTMLDivElement>(null)
  const {addPrize} = useStore();
  const {dialogData, callback, closeDialog} = useDialogStore()
  const [open, setOpen] = useState(false)

  function transitionEndHandler() {
    setWinHistory(winHistory.concat(rouletteWeapons[weaponPrizeId]))
    addPrize({
      name: rouletteWeapons[weaponPrizeId].fullName + "-" + rouletteWeapons[weaponPrizeId].position,
      prize: dialogData.prize,
      date: new Date()
    })
    setOpen(true);
    setIsSpin(false)
    setIsSpinEnd(true)
  }

  function prepare() {
    weaponsRef.current!.style.transition = "none"
    weaponsRef.current!.style.left = "0px"
  }

  function load() {
    let winner = weapons[Math.floor(Math.random() * weapons.length)];

    const roulette = new Roulette({
      winner,
      weapons,
      rouletteContainerRef,
      weaponsRef,
      weaponsCount: weaponsCount,
      transitionDuration: transitionDuration
    });
    roulette.set_weapons()
    setRouletteWeapons(roulette.weapons as any)

    return roulette
  }

  function play() {
    if (isReplay) {
      prepare()
    }
    setIsSpin(true)

    const roulette = load()

    setTimeout(() => {
      setIsSpin(true)
      setWeaponPrizeId(roulette.spin())
      setIsReplay(true)
    }, 500)
  }

  return (
    <div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          Người dành giải {dialogData?.prize} là <strong>{rouletteWeapons[weaponPrizeId]?.fullName}</strong>
          <DialogFooter>
            <Button variant="neutral" onClick={() => {
              setOpen(false);
              closeDialog()

            }}>Đóng</Button>
            <Button onClick={() => {
              setOpen(false);
              closeDialog()
              callback()
            }}>Quay tiếp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className={cl.rouletteWrapper}>
        <div ref={rouletteContainerRef}>
          <div className={cl.evRoulette}>
            <div className={cl.evTarget}></div>
            <div ref={weaponsRef} className={cl.evWeapons} onTransitionEnd={transitionEndHandler}>
              {rouletteWeapons.map((w, i) => {
                return <RouletteItem
                  key={i}
                  id={i}
                  isLoser={(i !== weaponPrizeId) && !isSpin && isSpinEnd}
                  fullName={w.fullName}
                  department={w.department}
                  luckyNumber={w.luckyNumber}
                  position={w.position}
                />
              })}
            </div>
          </div>
        </div>
        <Button className={cl.button} disabled={isSpin} onClick={play}>Quay</Button>
      </div>
    </div>
  )
    ;
};

export default McRoulette;