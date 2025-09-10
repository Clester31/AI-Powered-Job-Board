import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export function SidebarUserButton() {
    return <Suspense>
        <SidebarUserSuspense />
    </Suspense>
}

async function SidebarUserSuspense() {
    const { userId } = await auth()

    return <SidebarUserButtonClient user={{ email: "kyle@test.com", name: "Kyle Cook", imageUrl: "" }} /> 
}