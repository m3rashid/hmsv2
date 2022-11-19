/*
  Warnings:

  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empID]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dor` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empID` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "age",
DROP COLUMN "email",
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dor" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "empID" TEXT NOT NULL,
ADD COLUMN     "for" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL,
ADD COLUMN     "userData" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_empID_key" ON "Patient"("empID");
