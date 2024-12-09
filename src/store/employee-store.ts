import {create} from 'zustand';
import {Employee} from "@/models/roulette";


interface EmployeeStore {
  employees: Employee[]; // Danh sách nhân viên
  setEmployees: (employees: Employee[]) => void; // Gán nhiều nhân viên
}

const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  // Gán nhiều nhân viên cùng lúc
  setEmployees: (employees) =>
    set({
      employees,
    }),


}));

export default useEmployeeStore;
