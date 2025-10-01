import { inngest } from "@/services/inngest/client"
import {
  clerkCreateOrganization,
  clerkCreateOrgMembership,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteOrgMembership,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk"
import {
  prepareDailyOrganizationUserApplicationNotifications,
  prepareDailyUserJobListingNotifications,
  sendDailyOrganizationUserApplicationEmail,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email"
import { rankApplication } from "@/services/inngest/functions/jobListingApplication"
import { serve } from "inngest/next"
import { createAiSUmmaryOfUploadedResume } from "@/services/inngest/functions/resume";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    clerkCreateOrgMembership,
    clerkDeleteOrgMembership,
    createAiSUmmaryOfUploadedResume,
    rankApplication,
    sendDailyUserJobListingEmail,
    prepareDailyOrganizationUserApplicationNotifications,
    sendDailyOrganizationUserApplicationEmail,
  ],
})