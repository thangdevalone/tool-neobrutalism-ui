import {NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import {Employee} from "@/models";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Failed to fetch employees'}, {status: 500});
  }
}

export async function POST(req: Request) {
  try {
    const {employees} = await req.json();

    if (!Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json({error: 'Invalid data'}, {status: 400});
    }

    const createdEmployees = await prisma.employee.createMany({
      data: employees.map(({fullName, position, department, luckyNumber, stt}: Employee) => ({
        fullName,
        position,
        department,
        luckyNumber,
        stt,
      })),
    });

    return NextResponse.json(createdEmployees, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Failed to upload employees'}, {status: 500});
  }
}

export async function DELETE() {
  try {
    await prisma.employee.deleteMany();
    return NextResponse.json({message: 'All employees deleted successfully!'}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Failed to delete all employees'}, {status: 500});
  }
}