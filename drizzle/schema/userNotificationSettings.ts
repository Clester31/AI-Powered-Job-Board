import { boolean, pgTable, varchar } from "drizzle-orm/pg-core"
import { createdAt, updatedAt } from "../schemaHelpers"
import { UserTable } from "./user"
import { relations } from "drizzle-orm"

export const userNotificationSettingsTable = pgTable(
  "user_notification_settings",
  {
    userId: varchar()
      .primaryKey()
      .references(() => UserTable.id),
    newJobEmailNotifications: boolean().notNull().default(false),
    aiPrompt: varchar(),
    createdAt,
    updatedAt,
  }
)

export const userNotificationSettingsRelations = relations(
  userNotificationSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [userNotificationSettingsTable.userId],
      references: [UserTable.id],
    }),
  })
)