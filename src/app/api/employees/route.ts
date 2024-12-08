import {NextResponse} from 'next/server';
import prisma from '@/lib/prisma';

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
    const body = await req.json();

    // Kiểm tra dữ liệu đầu vào
    const {fullName, position, department} = body;
    if (!fullName || !position || !department) {
      return NextResponse.json(
        {error: 'All fields are required'},
        {status: 400}
      );
    }

    let randomStt: number;
    let existingEmployee: { stt: number } | null;

    do {
      randomStt = Math.floor(Math.random() * 100000);
      existingEmployee = await prisma.employee.findUnique({
        where: {stt: randomStt}, // Bây giờ Prisma sẽ nhận `stt` là duy nhất
      });
    } while (existingEmployee);

    // Tạo nhân viên mới trong database
    const newEmployee = await prisma.employee.create({
      data: {
        fullName,
        position,
        department,
        stt: randomStt,
      },
    });

    return NextResponse.json(newEmployee, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Failed to create employee'},
      {status: 500}
    );
  }
}
