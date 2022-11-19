/*
  Warnings:

  - Added the required column `type` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('EMPLOYEE', 'STUDENT', 'PENSIONER', 'FAMILY_PENSIONER', 'DEPENDANT');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "type" "PatientType" NOT NULL;
