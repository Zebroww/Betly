import { ProfileOverview } from "@/components/profile-overview"
import { ProfileSettings } from "@/components/profile-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ProfileOverview />
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
