import {persist} from 'zustand/middleware';
import {create} from 'zustand';

interface PrizeData {
  stt: number;
  name: string;
  prize: string;
  date: string;
}

interface StoreState {
  prizes: PrizeData[];
  nowPrize: string; // Adding the nowPrize field
  addPrize: (newPrize: Omit<PrizeData, 'stt'>) => void;
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
        set((state) => {
          const nextStt = state.prizes.length + 1;
          return {prizes: [...state.prizes, {...newPrize, stt: nextStt}]};
        }),
      removePrize: (stt) =>
        set((state) => ({
          prizes: state.prizes.filter((prize) => prize.stt !== stt),
        })),
      clearStore: () => set(() => ({prizes: []})),
      setNowPrize: (prize) => set(() => ({nowPrize: prize})), // Update the nowPrize
    }),
    {
      name: 'prizes-storage',
    }
  )
);
