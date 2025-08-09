import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditVenuePage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">
          Edit Venue: The Grand Meadow
        </CardTitle>
        <CardDescription>
          Update your venue details below. The form would be pre-filled with
          existing data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-12">
          A pre-filled venue editing form would be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}
