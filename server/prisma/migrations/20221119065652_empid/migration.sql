/*
  Warnings:

  - You are about to drop the column `empID` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Patient_empID_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "empID",
ADD COLUMN     "empId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_empId_key" ON "Patient"("empId");
