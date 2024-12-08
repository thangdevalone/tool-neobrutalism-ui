'use client';

import {useEffect, useState} from 'react';
import EmployeeForm from "@/components/forms/employee-form";
import {EmployeeFormValues} from "@/lib/validation";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

type Employee = {
  id: number;
  fullName: string;
  position: string;
  department: string;
};

const ManageEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    const response = await fetch('/api/employees');
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (data: EmployeeFormValues) => {
    // Khi chỉnh sửa, lấy id từ employee hiện tại, nếu không thì không có id
    const newEmployee = {
      ...data,
      id: editingEmployee ? editingEmployee.id : Date.now(), // Tạo id giả cho nhân viên mới
    };

    const method = editingEmployee ? 'PUT' : 'POST';
    const url = editingEmployee
      ? `/api/employees/${editingEmployee.id}`
      : '/api/employees';

    await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newEmployee),
    });

    await fetchEmployees();
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (id: number) => {
    await fetch(`/api/employees/${id}`, {method: 'DELETE'});
    fetchEmployees();
  };

  return (
    <div
      className="w-[calc(100vw_-_400px)] [background-size:16px_16px] ml-[400px] min-h-[100dvh] sm:px-0 bg-bg px-5 pt-[88px] md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full sm:pt-16"
    >
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
      <EmployeeForm onSubmit={handleAddEmployee}/>

      <Table className="table-auto w-full ">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Họ và Tên</TableHead>
            <TableHead>Chức Danh</TableHead>
            <TableHead>Đơn Vị</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={employee.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageEmployees;
