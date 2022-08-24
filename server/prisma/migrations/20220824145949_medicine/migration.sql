/*
  Warnings:

  - The `CustomMedicines` column on the `Prescription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "CustomMedicines",
ADD COLUMN     "CustomMedicines" JSONB;
