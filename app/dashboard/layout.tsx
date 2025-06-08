import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("auth-token")?.value
  if (!token) redirect("/auth")

  return (
    <div className="">
      <AppSidebar />
      <main className="">{children}</main>
    </div>
  )
}
