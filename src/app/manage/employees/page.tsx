"use client"
import React, {useEffect, useState} from 'react';
import {EmployeeFormValues} from "@/lib/validation";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import * as XLSX from "xlsx";

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

  const handleDeleteEmployee = async (id: number) => {
    await fetch(`/api/employees/${id}`, {method: 'DELETE'});
    fetchEmployees();
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, {type: "array"});
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: EmployeeFormValues[] = XLSX.utils.sheet_to_json(worksheet);
      const mappedData = jsonData.map((row: any) => ({
        stt: row["STT"],
        fullName: row["Họ và Tên"],
        position: row["Chức danh"],
        department: row["Đơn vị"],
        luckyNumber: row["Số may mắn"],
      }));
      console.log(mappedData)
      await fetch('/api/employees', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({employees: mappedData}),
      });

      await fetchEmployees();
    };

    reader.readAsArrayBuffer(file);
  };
  const handleDeleteAllEmployees = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả nhân viên?')) {
      await fetch('/api/employees', {method: 'DELETE'});
      await fetchEmployees();
    }
  };
  return (
    <div
      className="w-[calc(100vw_-_400px)] [background-size:16px_16px] ml-[400px] h-[100dvh] sm:px-0 bg-bg px-5 py-[88px] md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full overflow-y-auto sm:pt-16"
    >
      <h1 className="text-2xl font-bold my-4">Quản lý nhân viên</h1>
      <div className="mb-4 flex flex-row gap-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="file-input"
        />
        <Button
          className="bg-red-500 text-white hover:bg-red-700"
          onClick={handleDeleteAllEmployees}
        >
          Xóa tất cả
        </Button>
      </div>
      <Table className="table-auto w-full">
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
                <Button onClick={() => handleDeleteEmployee(employee.id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageEmployees;
