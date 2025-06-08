import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const token = cookies().get("auth-token")?.value
  if (token) redirect("/dashboard")

  return <>{children}</>
}
