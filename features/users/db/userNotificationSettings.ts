import { db } from "@/drizzle/db";
import { userNotificationSettingsTable } from "@/drizzle/schema";

export async function insertUserNotificationSettings(
  settings: typeof userNotificationSettingsTable.$inferInsert
) {
  await db
    .insert(userNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing()
}
