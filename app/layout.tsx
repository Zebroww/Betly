import { ReactNode } from "react"
import { cookies } from "next/headers"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const token = cookies().get("auth-token")?.value


   return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center px-4">
                <SidebarTrigger />
                <div className="ml-auto flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}
