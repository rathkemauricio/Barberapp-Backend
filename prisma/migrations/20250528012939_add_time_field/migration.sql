/*
  Warnings:

  - You are about to drop the `_AppointmentToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_B_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "serviceId" TEXT;

-- DropTable
DROP TABLE "_AppointmentToService";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
