/*
  Warnings:

  - A unique constraint covering the columns `[storeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_storeId_key" ON "users"("storeId");
