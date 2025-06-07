/*
  Warnings:

  - You are about to drop the column `points` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "points";

-- CreateTable
CREATE TABLE "Fidelity" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Fidelity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fidelity_customerId_key" ON "Fidelity"("customerId");

-- AddForeignKey
ALTER TABLE "Fidelity" ADD CONSTRAINT "Fidelity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
