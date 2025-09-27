"use server"

import { db } from "@/drizzle/db";
import { JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { getJobListingsIdTag } from "@/features/jobListings/db/cache/jobListings";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { permission } from "process";
import z from "zod";
import { newJobListingApplicationSchema } from "./schemas";
import { insertJobListingApplication } from "../db/jobListingApplications";
import { inngest } from "@/services/inngest/client";

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof newJobListingApplicationSchema>,
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application"
  }

  const { userId } = await getCurrentUser()
  if(userId == null) return permission

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublicJobListing(jobListingId)
  ])

  if(userResume == null || jobListing == null) return permissionError

  const { success, data } = newJobListingApplicationSchema.safeParse(unsafeData)

  if(!success) {
    return {
      error: true,
      message: "There was an error submitting your application"
    }
  }

  await insertJobListingApplication({
    jobListingId,
    userId,
    ...data
  })

  // TODO: AI Generation
  await inngest.send({
    name: "app/jobListingApplication.created",
    data: { jobListingId, userId }
  })

  return {
    error: false,
    message: "Your application was successfully submitted"
  }
}

async function getPublicJobListing(id: string) {
  "use cache"
  cacheTag(getJobListingsIdTag(id))

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    columns: { id: true },
  })
}

async function getUserResume(userId: string) {
  "use cache"
  cacheTag(getUserResumeIdTag(userId))

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: { userId: true },
  })
}