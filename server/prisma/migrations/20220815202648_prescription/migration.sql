/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `MedicineId` to the `PrescribedMedicine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrescribedMedicine" DROP CONSTRAINT "PrescribedMedicine_id_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- AlterTable
ALTER TABLE "PrescribedMedicine" ADD COLUMN     "MedicineId" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "doctorId";
ALTER TABLE "Prescription" DROP COLUMN "patientId";
ALTER TABLE "Prescription" ALTER COLUMN "diagnosis" DROP NOT NULL;

-- DropTable
DROP TABLE "Medicine";

-- AddForeignKey
ALTER TABLE "PrescribedMedicine" ADD CONSTRAINT "PrescribedMedicine_MedicineId_fkey" FOREIGN KEY ("MedicineId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
