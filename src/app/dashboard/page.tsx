import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/venues/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Venue
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">
              Welcome, Venue Owner!
            </CardTitle>
            <CardDescription>
              Manage your venues and bookings here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Use the navigation on the left to get started. You can add a new
              venue, manage existing ones, or use our AI Pricing Assistant to
              optimize your revenue.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary bg-primary/10">
          <CardHeader>
            <CardTitle className="font-headline">Need a pricing boost?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our AI Pricing Assistant can help you set the optimal price for
              your venue. Give it a try!
            </p>
            <Button asChild className="mt-4" variant="link" >
              <Link href="/dashboard/venues/1/pricing-assistant">
                Try AI Pricing &rarr;
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
