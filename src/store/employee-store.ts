import {create} from 'zustand';
import {Employee} from "@/models";


interface EmployeeStore {
  employees: Employee[]; // Danh sách nhân viên
  setEmployees: (employees: Employee[]) => void; // Gán nhiều nhân viên
}

const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees) =>
    set({
      employees,
    }),


}));

export default useEmployeeStore;
