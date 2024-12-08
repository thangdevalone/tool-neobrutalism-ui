import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.employee.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Failed to delete employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
