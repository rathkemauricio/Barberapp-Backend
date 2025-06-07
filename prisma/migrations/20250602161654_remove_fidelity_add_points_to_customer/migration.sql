/*
  Warnings:

  - You are about to drop the `Fidelity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fidelity" DROP CONSTRAINT "Fidelity_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD "points" INT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Fidelity";
