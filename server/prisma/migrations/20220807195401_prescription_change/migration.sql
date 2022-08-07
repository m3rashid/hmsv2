/*
  Warnings:

  - You are about to drop the column `CustomMedicines` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Prescription` table. All the data in the column will be lost.
  - Added the required column `customMedicines` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "CustomMedicines";
ALTER TABLE "Prescription" DROP COLUMN "doctorId";
ALTER TABLE "Prescription" DROP COLUMN "patientId";
ALTER TABLE "Prescription" ADD COLUMN     "customMedicines" STRING NOT NULL;
