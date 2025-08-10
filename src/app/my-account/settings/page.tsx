
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Account Information</CardTitle>
          <CardDescription>
            Manage your public profile and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile and account settings form would be here.</p>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notifications</CardTitle>
          <CardDescription>
            Configure your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Notification settings form would be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
