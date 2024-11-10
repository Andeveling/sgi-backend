/*
  Warnings:

  - Made the column `minStock` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "maxStock" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "minStock" SET NOT NULL,
ALTER COLUMN "minStock" SET DEFAULT 1;
