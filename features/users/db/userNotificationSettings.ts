import { db } from "@/drizzle/db";
import { userNotificationSettingsTable } from "@/drizzle/schema";
import { revalidateUserNotificationSettingsCache } from "./cache/userNotificationSettings";

export async function insertUserNotificationSettings(
  settings: typeof userNotificationSettingsTable.$inferInsert
) {
  await db
    .insert(userNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing()

    revalidateUserNotificationSettingsCache(settings.userId)
}
