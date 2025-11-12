-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isDarkMode" BOOLEAN DEFAULT false,
ADD COLUMN     "notifications" BOOLEAN DEFAULT true;
