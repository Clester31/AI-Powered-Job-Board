import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { Suspense } from "react";

type Props = {
    params: Promise<{ jobListingId: string }>
}

export default function JobListingPage(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  )
}

async function SuspendedPage({ params }: Props) {
    const { orgId } = await getCurrentOrganization()
    if(orgId == null) return null
}
