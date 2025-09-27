"use server"

import { db } from "@/drizzle/db";
import { userNotificationSettingsTable } from "@/drizzle/schema";
import { revalidateUserNotificationSettingsCache } from "./cache/userNotificationSettings";

export async function insertUserNotificationSettings(
  settings: typeof userNotificationSettingsTable.$inferInsert
) {
  await db
    .insert(userNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateUserNotificationSettingsCache(settings.userId);
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: Partial<
    Omit<typeof userNotificationSettingsTable.$inferInsert, "userId">
  >
) {
  await db
    .insert(userNotificationSettingsTable)
    .values({ ...settings, userId })
    .onConflictDoUpdate({
      target: userNotificationSettingsTable.userId,
      set: settings,
    })

  revalidateUserNotificationSettingsCache(userId)
}
