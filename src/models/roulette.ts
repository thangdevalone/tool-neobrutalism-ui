import {Ref} from "react";

export interface weaponAttributes {
  stt: number,
  luckyNumber: number,
  fullName: string,
  position: string
  department: string
  avatar: string,
}

// КЛАСС ОРУЖИЯ
export class Employee {
  id: number
  stt: number
  fullName: string
  luckyNumber: number
  position: string
  department: string
  avatar?: string

  constructor(id: number, attrs: weaponAttributes) {
    this.id = id;

    // атрибуты с сервера
    this.stt = attrs.stt;
    this.fullName = attrs.fullName;
    this.position = attrs.position;
    this.department = attrs.department;
    this.luckyNumber = attrs.luckyNumber;

  }

}

export interface rouletteAttributes {
  winner: weaponAttributes
  weapons: weaponAttributes[]

  rouletteContainerRef: Ref<HTMLElement>
  weaponsRef: Ref<HTMLElement>

  weaponsCount?: number
  transitionDuration?: number
  itemWidth?: number
}

// КЛАСС РУЛЕТКИ
export class Roulette {

  winner: weaponAttributes
  allWeapons: weaponAttributes[]

  rouletteWrapper: Ref<HTMLElement>
  weaponWrapper: Ref<HTMLElement>

  weapons: Employee[]

  weaponsCount: number
  weaponPrizeId: number

  transitionDuration: number

  itemWidth: number

  constructor(attrs: rouletteAttributes) {
    // атрибуты для генерации массива weapons
    this.winner = attrs.winner;
    this.allWeapons = attrs.weapons;

    // тут будет всё оружие (оружие-приз + оружие-актёры)
    this.weapons = [];

    // родительский DOM-элемент для рулетки
    this.rouletteWrapper = attrs.weaponsRef;

    // родительский DOM-элемент для DOM-элементов оружия (он вращается)
    this.weaponWrapper = attrs.weaponsRef;

    // общее количество оружия
    this.weaponsCount = attrs.weaponsCount || 50;

    // id приза
    this.weaponPrizeId = this.randomRange(this.weaponsCount / 2, this.weaponsCount - 5)

    this.transitionDuration = attrs.transitionDuration || 10

    this.itemWidth = attrs.itemWidth || 200
  }

  private randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  set_weapons = () => {
    let weapons: Employee[] = [] // объявляем массив оружия
    let weapon_actors_len = this.allWeapons.length  // количество оружия пришедшее с бд

    const set_weapon_actors = (from_i: number, to_i: number) => {
      let j = 0
      const createdWeapons: Employee[] = []
      for (let i = from_i; i <= to_i; i += 1) {
        // создаем оружие с индексом i и атрибутами j
        createdWeapons.push(new Employee(i, this.allWeapons[j]))
        j = (j === weapon_actors_len - 1) ? 0 : j + 1;
      }
      this.shuffle(createdWeapons)
      return createdWeapons
    };

    // нет оружия с бд - ошибка
    if (weapon_actors_len === 0) {
      throw new Error('Ошибка! Нет актёров.');
    }

    /**
     * сетаем оружия в размере количества
     *  оружия в рулетке с 0 до id приза
     */
    weapons = weapons.concat(set_weapon_actors(0, this.weaponPrizeId - 1))

    // создаем оружие приз
    weapons[this.weaponPrizeId] = new Employee(this.weaponPrizeId, this.winner);

    /** сетаем оружия в id приза до конца */
    weapons = weapons.concat(set_weapon_actors(this.weaponPrizeId + 1, this.weaponsCount - 1))
    this.weapons = weapons;
  };

  /** ВРАЩЕНИЕ РУЛЕТКИ
   -----------------------------------------------------------------------------*/
  spin = () => {
    let el_weapon_width_1_2 = Math.floor(this.itemWidth / 2)
    let el_weapon_width_1_20 = Math.floor(this.itemWidth / 20)

    // рандомная координата остановки
    const randStop = (this.weaponPrizeId - 4) * this.itemWidth +
      el_weapon_width_1_2 +
      this.randomRange(el_weapon_width_1_20, (18 * el_weapon_width_1_20))

    // анимация теперь через 'transition', а не через 'animation'
    // 'ease-out' -- это плавное замедление рулетки
    // @ts-ignore
    this.weaponWrapper.current.style.transition = `left ${this.transitionDuration}s ease-out`;

    // немного отложенный старт
    // (ибо нельзя сразу установить css-свойство 'left')
    setTimeout(() => {
      // @ts-ignore
      this.weaponWrapper!.current.style.left = `-${randStop}px`;
    }, 100);

    return this.weaponPrizeId
  }
}