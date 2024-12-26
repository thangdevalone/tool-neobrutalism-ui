import {persist} from 'zustand/middleware';
import {create} from 'zustand';

interface PrizeData {
  stt: number;
  fullName: string;
  luckyNumber: string | number; // Consider narrowing `any` to string or number
  position: string;
  prize: string;
  date: Date;
}

interface StoreState {
  prizes: PrizeData[];
  nowPrize: string; // Field to track the current prize
  addPrize: (newPrize: PrizeData) => void;
  removePrize: (stt: number) => void;
  clearStore: () => void;
  setNowPrize: (prize: string) => void;
}

export const useStore = create(
  persist<StoreState>(
    (set) => ({
      prizes: [],
      nowPrize: "",
      addPrize: (newPrize) =>
        set((state) => ({
          prizes: [...state.prizes, newPrize], // Use `stt` from the provided `newPrize`
        })),
      removePrize: (stt) =>
        set((state) => ({
          prizes: state.prizes.filter((prize) => prize.stt !== stt),
        })),
      clearStore: () => set(() => ({prizes: []})),
      setNowPrize: (prize) => set(() => ({nowPrize: prize})), // Update `nowPrize`
    }),
    {
      name: 'prizes-storage',
    }
  )
);
