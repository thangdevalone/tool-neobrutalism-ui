import {persist} from 'zustand/middleware';
import {create} from 'zustand';

interface PrizeData {
  stt: number;
  fullName: string;
  luckyNumber: string | number;
  position: string;
  prize: string;
  date: Date;
}

interface StoreState {
  prizes: PrizeData[];
  nowPrize: string; // Field to track the current prize
  deletePrize: string | null; // Store the prize name of the last deleted prize
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
      deletePrize: null, // Initialize as null
      addPrize: (newPrize) =>
        set((state) => ({
          prizes: [...state.prizes, newPrize], // Add the new prize to the list
        })),
      removePrize: (stt) =>
        set((state) => {
          // Find the prize to be removed
          const prizeToDelete = state.prizes.find((prize) => prize.stt === stt);
          return {
            prizes: state.prizes.filter((prize) => prize.stt !== stt),
            deletePrize: prizeToDelete ? prizeToDelete.prize : null, // Store deleted prize name or null
          };
        }),
      clearStore: () =>
        set(() => ({
          prizes: [],
          deletePrize: null, // Clear deletePrize when resetting
        })),
      setNowPrize: (prize) => set(() => ({nowPrize: prize})), // Update `nowPrize`
    }),
    {
      name: 'prizes-storage',
    }
  )
);
