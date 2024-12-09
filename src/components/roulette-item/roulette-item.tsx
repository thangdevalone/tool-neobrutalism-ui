import React from 'react';
import cl from "./roulette-item.module.scss"

interface rouletteItemProps {
  id: number,
  luckyNumber: number,
  fullName: string,
  position: string
  department: string
  avatar?: string,
  isLoser: boolean,
}

const RouletteItem = ({
                        id,
                        luckyNumber,
                        fullName,
                        position,
                        department,
                        isLoser
                      }: rouletteItemProps) => {
  return (
    <div className={cl.evWeapon} style={isLoser ? {opacity: "0.5"} : {opacity: "1"}}>
      <div className={`${cl.evWeaponInner} text-white`} id={String(id)}>
        <img src={"#"} alt={fullName}/>
        <div className={cl.evWeaponText}>
          <p>{fullName}</p>
          <p>{department}</p>
        </div>
      </div>
    </div>
  );
};

export default RouletteItem;