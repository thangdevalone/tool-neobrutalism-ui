import { z } from 'zod';

export const employeeSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải ít nhất 2 ký tự'),
  position: z.string().min(2, 'Chức danh phải ít nhất 2 ký tự'),
  department: z.string().min(2, 'Đơn vị phải ít nhất 2 ký tự'),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
