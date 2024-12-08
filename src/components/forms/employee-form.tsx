'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {EmployeeFormValues, employeeSchema} from '@/lib/validation';
import {Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

type EmployeeFormProps = {
  defaultValues?: EmployeeFormValues;
  onSubmit: (data: EmployeeFormValues) => void;
};

const EmployeeForm = ({defaultValues, onSubmit}: EmployeeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<EmployeeFormValues>({
    defaultValues,
    resolver: zodResolver(employeeSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2">
          {defaultValues ? 'Chỉnh sửa' : 'Thêm mới'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{defaultValues ? 'Chỉnh sửa nhân viên' : 'Thêm mới nhân viên'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium">
              Họ và Tên
            </Label>
            <Input
              {...register('fullName')}
              id="fullName"
              className="input"
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="position" className="block text-sm font-medium">
              Chức Danh
            </Label>
            <Input
              {...register('position')}
              id="position"
              className="input"
              placeholder="Kỹ sư"
            />
            {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
          </div>

          <div>
            <Label htmlFor="department" className="block text-sm font-medium">
              Đơn Vị
            </Label>
            <Input
              {...register('department')}
              id="department"
              className="input"
              placeholder="Phòng kỹ thuật"
            />
            {errors.department && (
              <p className="text-red-500 text-sm">{errors.department.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">
              {defaultValues ? 'Lưu' : 'Thêm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
