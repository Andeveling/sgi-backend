/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `stores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cellphone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cellphone` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "phoneNumber",
ADD COLUMN     "cellphone" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "users_cellphone_key" ON "users"("cellphone");
