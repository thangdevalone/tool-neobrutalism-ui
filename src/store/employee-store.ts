import {create} from 'zustand';
import {Employee} from "@/models";

interface EmployeeStore {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void; // Gán nhiều nhân viên
  removeEmployee: (id: number) => void; // Xoá nhân viên dựa trên ID
}

const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees) =>
    set({
      employees,
    }),
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((employee) => employee.id !== id),
    })),
}));

export default useEmployeeStore;
