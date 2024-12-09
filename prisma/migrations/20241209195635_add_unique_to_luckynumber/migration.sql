/*
  Warnings:

  - A unique constraint covering the columns `[luckyNumber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `luckyNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "luckyNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_luckyNumber_key" ON "Employee"("luckyNumber");
