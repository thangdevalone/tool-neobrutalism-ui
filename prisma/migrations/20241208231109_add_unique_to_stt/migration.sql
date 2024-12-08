-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "stt" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_stt_key" ON "Employee"("stt");
